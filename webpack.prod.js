const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: {
		app: './src/index.js'
	},
	output: {
		filename: 'static/[name].[chunkhash:8].js',
		chunkFilename: 'static/[name].[chunkhash:8].js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env'],
						plugins: ['dynamic-import-webpack']
					}
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {limit: 20000}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: ['file-loader']
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist/*.*', 'dist/static/*.*']), //clean dist
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/views/index.html'
		}),
		//保持vendor hash不变
		new webpack.HashedModuleIdsPlugin(),
		//提取公共代码
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function(module, count) {
				return module.resource && /\.js$/.test(module.resource) &&
				module.resource.indexOf(
		        	path.join(__dirname, './node_modules')
		        ) === 0
			}
		}),
		//提取样板，缓存vendor
		new webpack.optimize.CommonsChunkPlugin({
			name: 'runtime',
			chunks: ['vendor']
		}),
		new webpack.optimize.UglifyJsPlugin()
	]
}