// 로그인 받을 때
// array('email' => '', 'password' => '', 'remember' => bool)
// 로그인 리턴할 때
// array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url')

import Axios from "axios"
import TextInput from "./TextInput"

;["load", "pjax:complete"].forEach(eventName => {
	document.addEventListener(eventName, e => {

		if (document.querySelector("#login-main")) {
			class SignInInput extends TextInput {
				constructor(inputDOM: HTMLInputElement) {
					super(inputDOM)
				}
			}

			let identifierInputDOM: HTMLInputElement = document.querySelector(
				".input-wrapper.identifier input"
			)
			let passInputDOM: HTMLInputElement = document.querySelector(
				".input-wrapper.password input"
			)
			let confirmButton: HTMLButtonElement = document.querySelector(
				"button.confirm"
			)

			let identifierInputObj = new SignInInput(identifierInputDOM)
			let passInputObj = new SignInInput(passInputDOM)

			identifierInputDOM.addEventListener("keyup", function(e) {
				if (this.value.includes("@")) {
					this.parentElement.classList.add("email")
				} else {
					this.parentElement.classList.remove("email")
				}

				if (e.which === 13) {
					confirmButton.click()
				}
			})

			passInputDOM.addEventListener("keyup", function(e) {
				if (e.which === 13) {
					confirmButton.click()
				}
			})

			confirmButton.addEventListener("click", function() {
				var inputData = {
					identifier: identifierInputDOM.value,
					password: passInputDOM.value
				}

				Axios({
					method: "post",
					url: "/login",
					data: inputData
				}).then(function(response) {
					let data = response.data

					if (data !== "") {
						if (data["err"]) {
							// alert(data["msg"])
							setErrorMsg(data["msg"])
						} else {
							location.replace(data["redirect"])
						}
					}
				})
			})

			function setErrorMsg(str: string) {
				let msgBox = document.querySelector("#login-main .error-message")
				if (str.length === 0) {
					msgBox.innerHTML = ""
					msgBox.classList.add("hidden")
				} else {
					msgBox.innerHTML = str
					msgBox.classList.remove("hidden")
				}
			}
		}

})
})