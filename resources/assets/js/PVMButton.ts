export default class PVMButton {
	btnElem: HTMLButtonElement
	initValue: string

	constructor(btnElem: HTMLButtonElement) {
		this.btnElem = btnElem
		this.initValue = btnElem.value
	}

	showErr(message: string) {
		this.btnElem.value = message
		this.btnElem.classList.add("error")
	}

	startSpinner() {
		this.btnElem.disabled = true
		let spinner = document.createElement("div")
		spinner.className = "spinner"
	}

	stopSpinner() {
		this.btnElem.disabled = false
	}

	init() {
		this.btnElem.classList.remove("error")
		this.btnElem.value = this.initValue
	}
}