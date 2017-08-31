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