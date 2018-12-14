import Axios from "axios"
import TextInput from "../TextInput"
import PVMButton from "../PVMButton"

;["load", "pjax:complete"].forEach(eventName => {
	window.addEventListener(eventName, e => {

		if (document.querySelector("#register-main")) {
			let startButton: HTMLButtonElement = document.querySelector("button.start")
			let PVMStartButton = new PVMButton(startButton)

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
						}, 500)
					})

					;["focus", "input"].forEach(eventName => {
						this.target.addEventListener(eventName, e => {
							PVMStartButton.init()
						})
					})

					this.target.addEventListener("focusout", function() {
						// console.log('focused out')
					})
				}
			}

			let readableIDInputDOM: HTMLInputElement = document.querySelector(
				"#register-main .input-wrapper.readable-id input"
			)
			let nameInputDOM: HTMLInputElement = document.querySelector(
				"#register-main .input-wrapper.name input"
			)
			let passInputDOM: HTMLInputElement = document.querySelector(
				"#register-main .input-wrapper.password input"
			)

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

			function checkValidation(allowEmpty: boolean = true) {
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
				 
					if (data["readable_id_return"]["err"]) {
						readableIDInputObj.showMsg(data["readable_id_return"]["msg"], allowEmpty)
					} else {
						readableIDInputObj.hideMsg()
					}
				 
					if (data["name_return"]["err"]) {
						nameInputObj.showMsg(data["name_return"]["msg"], allowEmpty)
					} else {
						nameInputObj.hideMsg()
					}
				 
					if (data["password_return"]["err"]) {
						passInputObj.showMsg(data["password_return"]["msg"], allowEmpty)
						passStrengthIndicator.hide()
					} else {
						passInputObj.hideMsg()
						passStrengthIndicator.setStrength(
							data["password_return"]["strength"]
						)
					}
				 
				})
				.catch(function(error) {
					console.log(error)
				})				
			}

			startButton.addEventListener("click", function() {
				var inputData = {
					readable_id: readableIDInputDOM.value,
					name: nameInputDOM.value,
					password: passInputDOM.value
				}

				PVMStartButton.startSpinner()

				Axios({
					method: "post",
					url: "/register",
					data: inputData
				}).then(function(response) {
					let data = response.data
					console.log(data)
					if (data !== "") {
						if (data["err"]) {
							console.log("error")

							checkValidation(false)
							// alert(data['msg'])
							// setErrorMsg(data["msg"])
							PVMStartButton.stopSpinner()
							PVMStartButton.showErr("입력정보를 다시 확인하세요.")
							
						} else {
							location.replace(data["redirect"])
						}
					}
				})
			})

			let passwordViewBtn = document.querySelector("#register-main .view")
			passwordViewBtn.addEventListener("click", e => {
				togglePassView()
			})

			function togglePassView() {
				if (passInputObj.target.type === "password") {
					passInputObj.target.type = "text"
				} else {
					passInputObj.target.type = "password"
				}
			}

			function setErrorMsg(str: string) {
				let msgBox = document.querySelector("#register-main .error-message")
				if (str.length === 0) {
					msgBox.innerHTML = ""
					msgBox.classList.add("hidden")
				} else {
					msgBox.innerHTML = str
					msgBox.classList.remove("hidden")
				}
			}

			const passStrengthIndicator = {
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

	})
})