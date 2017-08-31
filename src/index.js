import './assets/css/main.css'
import Img1 from './assets/img/1.jpg'
import Img2 from './assets/img/2.jpg'

import mod1 from './assets/js/mod1'

function start() {
	const app = document.querySelector('#app')

	const img1 = new Image()
	const img2 = new Image()
	img1.src = Img1
	img2.src = Img2

	const p = document.createElement('p')
	p.innerHTML = '苹果熊啊'
	app.appendChild(img1)
	app.appendChild(img2)
	app.appendChild(p)
}

start()
mod1('模块1')