import Axios from "axios"
import TextInput from "./TextInput"

if (document.querySelector("#register-main")) {
	class RegInput extends TextInput {
		constructor(inputDOM: HTMLInputElement) {
			super(inputDOM)

			let self = this
			let wait: NodeJS.Timeout

			this.target.addEventListener("keyup", function() {
				clearTimeout(wait)

				var inputData = self.target.value

				if (inputData === "") {
					self.hideMsg()
					if (self.target.classList.contains("password")) {
						passStrengthIndicator.hide()
					}
					return
				}

				wait = setTimeout(() => {
					checkValidation()
				}, 300)
			})

			this.target.addEventListener("focusout", function() {
				// console.log('focused out')
			})
		}
	}

	let readableIDInputDOM: HTMLInputElement = document.querySelector(
		".input-wrapper.readable-id input"
	)
	let nameInputDOM: HTMLInputElement = document.querySelector(
		".input-wrapper.name input"
	)
	let passInputDOM: HTMLInputElement = document.querySelector(
		".input-wrapper.password input"
	)
	let startButton: HTMLButtonElement = document.querySelector("button.start")

	let readableIDInputObj = new RegInput(readableIDInputDOM)
	let nameInputObj = new RegInput(nameInputDOM)
	let passInputObj = new RegInput(passInputDOM)

	let doms = [readableIDInputDOM, nameInputDOM, passInputDOM]

	doms.forEach(dom => {
		dom.addEventListener("keydown", e => {
			if (e.keyCode === 13) {
				startButton.click()
			}
		})
	})

	function checkValidation(except_empty: boolean = true) {
		var inputData = {
			readable_id: readableIDInputDOM.value,
			name: nameInputDOM.value,
			password: passInputDOM.value
		}

		Axios({
			method: "put",
			url: "/register",
			data: inputData
		})
			.then(function(response) {
				let data = response.data
				try {
					if (data !== "") {
						if (data["readable_id_return"]["err"]) {
							if (inputData.readable_id === "" && except_empty) {

							} else {
                                readableIDInputObj.showMsg(data["readable_id_return"]["msg"])
							}
						} else {
							readableIDInputObj.hideMsg()
						}

						if (data["name_return"]["err"]) {
                            if (inputData.name === "" && except_empty) {

                            } else {
                                nameInputObj.showMsg(data["name_return"]["msg"])
                            }
						} else {
							nameInputObj.hideMsg()
						}

						if (data["password_return"]["err"]) {
                            if (inputData.password === "" && except_empty) {

                            } else {
                                passInputObj.showMsg(data["password_return"]["msg"])
                            }

							passStrengthIndicator.hide()
						} else {
							passInputObj.hideMsg()
							passStrengthIndicator.setStrength(
								data["password_return"]["strength"]
							)
						}
					}
				} catch (error) {
					console.log(error)
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	}

	startButton = document.querySelector("button.start")

	if (startButton) {
		startButton.addEventListener("click", function() {
			var inputData = {
				readable_id: readableIDInputDOM.value,
				name: nameInputDOM.value,
				password: passInputDOM.value
			}

			Axios({
				method: "post",
				url: "/register",
				data: inputData
			}).then(function(response) {
				let data = response.data
				console.log(data)
				if (data !== "") {
					if (data["err"]) {
						checkValidation(false)
                        alert(data['msg'])
					} else {
						location.replace(data["redirect"])
					}
				}
			})
		})
	}

	let passwordViewBtn = document.querySelector("#register-main .view")
	if (passwordViewBtn) {
		passwordViewBtn.addEventListener("click", e => {
			togglePassView()
		})
	}

	function togglePassView() {
		if (passInputObj.target.type === "password") {
			passInputObj.target.type = "text"
		} else {
			passInputObj.target.type = "password"
		}
	}

	let passStrengthIndicator = {
		dom: document.querySelector("#register-main .strength"),

		show: function() {
			this.dom.classList.remove("hidden")
		},

		hide: function() {
			this.dom.classList.add("hidden")
			this.dom.querySelectorAll(".bar").forEach(function(bar: HTMLElement) {
				bar.classList.remove("active")
			})
		},

		setStrength: function(level: number) {
			let self = this
			this.show()
			setTimeout(() => {
				if (level === 0) {
					if (this.dom.querySelector(".bar-2").classList.contains("active")) {
						this.dom.querySelector(".bar-2").classList.remove("active")
						setTimeout(() => {
							this.dom.querySelector(".bar-1").classList.remove("active")
						}, 150)
					} else if (
						this.dom.querySelector(".bar-1").classList.contains("active")
					) {
						this.dom.querySelector(".bar-1").classList.remove("active")
					} else if (
						this.dom.querySelector(".bar-0").classList.contains("active")
					) {
					} else {
						this.dom.querySelector(".bar-0").classList.add("active")
					}
				} else if (level === 1) {
					if (this.dom.querySelector(".bar-2").classList.contains("active")) {
						this.dom.querySelector(".bar-2").classList.remove("active")
					} else if (
						this.dom.querySelector(".bar-1").classList.contains("active")
					) {
					} else if (
						this.dom.querySelector(".bar-0").classList.contains("active")
					) {
						this.dom.querySelector(".bar-1").classList.add("active")
					} else {
						this.dom.querySelector(".bar-0").classList.add("active")
						setTimeout(() => {
							this.dom.querySelector(".bar-1").classList.add("active")
						}, 150)
					}
				} else if (level === 2) {
					if (this.dom.querySelector(".bar-2").classList.contains("active")) {
					} else if (
						this.dom.querySelector(".bar-1").classList.contains("active")
					) {
						this.dom.querySelector(".bar-2").classList.add("active")
					} else if (
						this.dom.querySelector(".bar-0").classList.contains("active")
					) {
						this.dom.querySelector(".bar-1").classList.add("active")
						setTimeout(() => {
							this.dom.querySelector(".bar-2").classList.add("active")
						}, 150)
					} else {
						this.dom.querySelector(".bar-0").classList.add("active")
						setTimeout(() => {
							this.dom.querySelector(".bar-1").classList.add("active")
							setTimeout(() => {
								this.dom.querySelector(".bar-2").classList.add("active")
							}, 150)
						}, 150)
					}
				}
			}, 200)
		}
	}
}
