const path = require('path')
const UglifyJS = require('uglify-es')
const fs = require('fs')

//默认配置
const DEFAULT_OPTIONS = {
	template: 'index.html',
	minify: false
}

class InsertContentPlugin {
	constructor(options) {
		this.options = Object.assign({}, DEFAULT_OPTIONS, options)
	}
	apply(compiler) {
		compiler.plugin('emit', (compilation, callback) => {
			const html = compilation.assets[this.options.template].source()
			const new_html = this.createContent(html)
			compilation.assets[this.options.template] = {
				source() {
					return new_html
				},
				size() {
					return new_html.length
				}
			}
			callback()
		})
	}
	createContent(contents) {
		let codes = '', cont = contents
		if(this.options.jsFile) {
			codes = fs.readFileSync(path.join(process.cwd(), this.options.jsFile), 'utf-8')
			console.log(codes)
		}
		if(this.options.jsString) {
			codes = codes + ';' + this.options.jsString
		}
		if(this.options.thirdScript) {
			cont = cont.replace(/<\/body>/, bodyTag => {
				return `<script ${this.options.thirdScript.async ? 'defer' : ''} src=${this.options.thirdScript.src}></script>${bodyTag}`
			})
		}
		if(this.options.meta) {
			const meta = this.options.meta
			if(Array.isArray(meta) && meta.length > 0) {
				const _meta = meta.map(metaList => {
					return `<meta ${Object.keys(metaList).map(key => {
						return `${key}='${metaList[key]}'`
					}).join(' ')}>`
				}).join('')
				cont = cont.replace(/<head>/, headTag => {
					return `${headTag}${_meta}`
				})
			} else if(!this.isEmpty(meta)) {
				cont = cont.replace(/<head>/, headTag => {
					return `${headTag}<meta ${Object.keys(meta).map(key => {
						return `${key}='${meta[key]}'`
					}).join(' ')}>`
				})
			}
		}
		return cont.replace(/<\/body>/, bodyTag => {
			return `<script>${this.options.minify ? UglifyJS.minify(codes).code : codes}</script>${bodyTag}`
		})
	}
	isEmpty(obj) {
		for(var i in obj) {
			return false
		}
		return true
	}
}

module.exports = InsertContentPlugin
