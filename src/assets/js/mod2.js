export default class Sleep {
	constructor(x = 'A', y = 'B') {
		this.x = x
		this.y = y
	}
	show(str) {
		console.log(this.x + this.y + str)
	}
}