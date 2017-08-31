const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BearWebpackPlugin = require('./BearWebpackPlugin')

module.exports = {
	devtool: 'inline-source-map',
	entry: {
		app: './src/index.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: './dist',
		hot: true
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
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
				use: [
					{
						loader: 'url-loader',
						options: {limit: 60000}
					}
				]
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
	        'bear-loader': require('path').resolve('./bear-loader'),
	    },
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/views/index.html'
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
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
*/