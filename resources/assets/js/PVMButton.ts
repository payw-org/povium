export default class PVMButton {
	btnElem: HTMLButtonElement
	initValue: string
	lastModifiedValue: string

	constructor(btnElem: HTMLButtonElement) {
		this.btnElem = btnElem
		this.initValue = btnElem.innerHTML
		this.lastModifiedValue = this.initValue
	}

	setText(text: string) {
		this.lastModifiedValue = text
		this.btnElem.innerHTML = this.lastModifiedValue
	}

	showErr(message: string) {
		this.btnElem.innerHTML = message
		this.btnElem.classList.add("error")
	}

	startSpinner() {
		this.init()
		this.btnElem.disabled = true
		let spinner = document.createElement("div")
		spinner.className = "spinner"
		let ring = document.createElement("div")
		ring.className = "ring"
		spinner.appendChild(ring)
		let c
		while (c = this.btnElem.firstChild) {
			this.btnElem.removeChild(c)
		}
		this.btnElem.appendChild(spinner)
	}

	stopSpinner() {
		this.btnElem.disabled = false
		this.btnElem.removeChild(this.btnElem.querySelector(".spinner"))
		this.btnElem.innerHTML = this.lastModifiedValue
	}

	init() {
		this.btnElem.classList.remove("error")
		this.btnElem.innerHTML = this.initValue
	}
}