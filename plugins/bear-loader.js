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