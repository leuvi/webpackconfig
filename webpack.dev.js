const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BearWebpackPlugin = require('./plugins/BearWebpackPlugin')

module.exports = {
	devtool: 'inline-source-map',
	entry: {
		app: './src/index.js',
	},
	output: {
		filename: '[name].bundle.js'
	},
	// devServer: {
	// 	contentBase: './dist',
	// 	hot: true
	// },
	module: {
		rules: [
			// {
			// 	test: /\.css$/,
			// 	//use: ['style-loader', 'css-loader']
			// 	use: ExtractTextPlugin.extract({
			// 		fallback: 'style-loader',
			// 		use: {
			// 			loader: 'css-loader',
			// 			//css压缩
			// 			options: {
			// 				minimize: true
			// 			}
			// 		}
			// 	})
			// },
			{
				test: /\.styl$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: 'inline'
						}
					},
					'stylus-loader'
				]
			},
			{
				test: /\.jsx$/,
				use: ['bear-loader']
			},
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
				test: /\.(png|jpg|gif)$/,
				use: ['url-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: ['file-loader']
			}
		]
	},
	//自定义loader别名
	resolveLoader: {
	    alias: {
	        'bear-loader': require('path').resolve('./plugins/bear-loader'),
	    },
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/views/index.html'
		}),
		new webpack.HotModuleReplacementPlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		// 	sourceMap: true
		// }),
		//自定义插件
		new BearWebpackPlugin()
	]
}


/*
npm i --save-dev
webpack
style-loader
css-loader
file-loader
url-loader
html-webpack-plugin
clean-webpack-plugin
webpack-dev-server
babel-loader babel-core babel-preset-env
babel-plugin-dynamic-import-webpack //支持运行时import语法导入模块
extract-text-webpack-plugin //生成单独的css文件
compression-webpack-plugin //压缩插件
postcss-loader autoprefixer cssnano stylus stylus-loader //css处理
*/
