const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

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
				test: /\.styl$/,
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true
							}
						}, 
						'postcss-loader',
						'stylus-loader'
					]
				})
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							name: 'images/[name].[hash:8].[ext]'
						}
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
		//构建时清除dist文件夹
		new CleanWebpackPlugin(['dist/*']),
		//生成html首页
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/views/index.html',
			minify: {
		        removeComments: true,
		        collapseWhitespace: true,
		        removeRedundantAttributes: true,
		        useShortDoctype: true,
		        removeEmptyAttributes: true,
		        removeStyleLinkTypeAttributes: true,
		        keepClosingSlash: true,
		        minifyJS: true,
		        minifyCSS: true,
		        minifyURLs: true
		    }
		}),
		//生成css文件
		new ExtractTextPlugin('static/[name].[contenthash:8].css'),
		//保持vendor hash不变
		new webpack.HashedModuleIdsPlugin(),
		//提取公共代码
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function(module, count) {
		        return module.context && module.context.includes('node_modules')
			}
		}),
		//提取样板，缓存vendor
		new webpack.optimize.CommonsChunkPlugin({
			name: 'runtime',
			chunks: ['vendor']
		}),
		//js文件压缩
		new webpack.optimize.UglifyJsPlugin()
	]
}