### webpack config

个人写的webpack基本配置，包括自定义webpack插件和loader开发，仅供参考！


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
```


### webpack.prod.js

```js
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
