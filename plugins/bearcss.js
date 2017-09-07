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
