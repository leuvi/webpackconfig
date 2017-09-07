### webpack config

个人写的webpack基本配置  包括自定义postcss插件、webpack插件和loader开发，仅供参考！


### webpack.config.js

```js
module.exports = function(env) {
	return require(`./webpack.${env}.js`)
}
```


### webpack.dev.js

```js
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
	module: {
		rules: [
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
		//自定义插件
		new BearWebpackPlugin()
	]
}
```


### webpack.prod.js

```js
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
```


### custom postcss plugins `bearcss.js`
```js
const postcss = require('postcss')

module.exports = postcss.plugin('bearcss', (options = {}) => {
	return function(css) {
		css.walkRules(rule => {
			rule.walkDecls(/^background$/, decl => {
				//整个{...}
				let rule = decl.parent
				//console.log(decl.value)
				//插入样式
				rule.append({
					prop: 'color',
					value: 'red'
				})
			})
		})
	}
})
```


### custom webpack plugins `BearWebpackPlugin.js`

```js
function AppleBear(options) {
	this.options = options
}
AppleBear.prototype.apply = function(compiler) {
	compiler.plugin('compile', function(compilation) {
		console.log('compile!')
	})
	compiler.plugin('emit', function(compilation, callback) {
		console.log('emit!')
		callback()
	})
	compiler.plugin('done', function(compilation) {
		console.log('done!')
	})
}
module.exports = AppleBear
```


### custom webpack loader `bear-loader.js`

```js
module.exports = function(source) {
	console.log('bear-loader')
	console.log(source)
	const str = `

/*
	this is bear-loader test!
*/
`
	return source.replace(/applebear/g, 'APPLEBEAR!!!') + str
}
```
