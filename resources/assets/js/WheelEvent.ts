export default class WheelEvent {
	elem: HTMLElement
	onStart: Function
	onEnd: Function
	marker: boolean = true
	delta: number
	direction: string
	interval: number = 50
	counter1: number = 0
	counter2: number
	constructor(elem: HTMLElement, func: Function) {
		this.elem = elem
		this.elem.addEventListener("wheel", e => {
			func(e)
			this.counter1 += 1
			this.delta = e.deltaY || e.detail || e.wheelDelta
			if (this.delta > 0) {
				this.direction = "up"
			} else {
				this.direction = "down"
			}
			if (this.marker) this.wheelStart()
			return false
		})
	}

	wheelStart() {
		this.marker = false
		this.wheelAct()
		if (this.onStart) {
			this.onStart()
		}
	}

	wheelAct() {
		this.counter2 = this.counter1
		setTimeout(() => {
			if (this.counter2 == this.counter1) {
				this.wheelEnd()
			} else {
				this.wheelAct()
			}
		}, this.interval)
	}

	wheelEnd() {
		this.marker = true
		this.counter1 = 0
		this.counter2 = 0
		if (this.onEnd) {
			this.onEnd()
		}
	}
}
