import $ from 'jquery'
import _ from 'lodash'
import bear from './bear.jsx'

export default function (str) {
	console.log('加载' + str)
	import('./mod2').then(mod => {
		const Mod = mod['default']
		new Mod().show('模块2!')
	})
	// require.ensure([], function(require) {
	//     const mod2 = require('./mod2').default
	//     new mod2().show('模块2')
	// }, 'mod2')

	document.body.onclick = function() {
		require.ensure([], function(require) {
		    const mod3 = require('./mod3')
		    mod3.show('模块3')
		}, 'mod3')
	}
	console.log($('body'))
	console.log(_.shuffle([1, 2, 3, 4]))
	console.log(bear)
}

export function hehe(str) {
	console.log('hehe ' + str)
}