import TextInput from "./TextInput"
import AJAX from "./AJAX"

class RegInput extends TextInput {

	constructor (inputDOM) {
		super(inputDOM)

		var self = this

		this.target.addEventListener('keyup', function () {

			clearTimeout(this.wait)

			var inputData = self.target.value

			if (inputData === "") {
				self.hideMsg()
				if (self.target.classList.contains("password")) {
					passStrengthIndicator.hide()
				}
				return
			}

			this.wait = setTimeout(function () {
				checkValidation()
			}, 300)

		})

		this.target.addEventListener('focusout', function () {
			// console.log('focused out')
		})
	}

}

var readableIDInputDOM = document.querySelector('.input-wrapper.readable-id input')
var nameInputDOM = document.querySelector('.input-wrapper.name input')
var passInputDOM = document.querySelector('.input-wrapper.password input')
var startButton = document.querySelector('button.start')

if (readableIDInputDOM) {
	var readableIDInputObj = new RegInput(readableIDInputDOM)
	var nameInputObj = new RegInput(nameInputDOM)
	var passInputObj = new RegInput(passInputDOM)
}


readableIDInputDOM.addEventListener('keyup', function(e) {
	if (e.which === 13) {
		startButton.click()
	}
})
nameInputDOM.addEventListener('keyup', function(e) {
	if (e.which === 13) {
		startButton.click()
	}
})
passInputDOM.addEventListener('keyup', function(e) {
	if (e.which === 13) {
		startButton.click()
	}
})


function checkValidation () {

	var inputData = {
		readable_id: readableIDInputDOM.value,
		name: nameInputDOM.value,
		password: passInputDOM.value
	}

	var ajax = new AJAX()
	ajax.chirp({
		type: "put",
		url: "/register",
		data: JSON.stringify(inputData),
		success: function(response) {

			try {

				var result = JSON.parse(response)

				console.log(result)

				if (result['readable_id_return']['err']) {
					readableIDInputObj.showMsg(result['readable_id_return']['msg'])
				} else {
					readableIDInputObj.hideMsg()
				}

				if (result['name_return']['err']) {
					nameInputObj.showMsg(result['name_return']['msg'])
				} else {
					nameInputObj.hideMsg()
				}

				if (result['password_return']['err']) {
					passInputObj.showMsg(result['password_return']['msg'])
					passStrengthIndicator.hide()
				} else {
					passInputObj.hideMsg()
					passStrengthIndicator.setStrength(result['password_return']['strength'])
				}
				
			} catch (error) {
				alert(error + " " + response)
			}

		}
	})

}

var startButton = document.querySelector("button.start")
startButton.addEventListener("click", function() {

	var inputData = {
		readable_id: readableIDInputDOM.value,
		name: nameInputDOM.value,
		password: passInputDOM.value
	}

	var ajax = new AJAX()
	ajax.chirp({

		type: "post",
		url: "/register",
		data: JSON.stringify(inputData),

		success: function(response) {

			var result = JSON.parse(response)
			console.log(response)
			
			try {

				let result = JSON.parse(response)
				
				if (result['err']) {

					alert("입력 정보에 문제가 있어요!")

				} else {

					window.location.replace(result['redirect'])

				}

			} catch(e) {

				alert(e + " " + response)

			}

		}
	})
})

document.querySelector('#register-main .view').addEventListener('click', e => { togglePassView(e) })

function togglePassView(e) {
	if (document.querySelector('input.password').type === "password") {
		document.querySelector('input.password').type = "text"
	} else {
		document.querySelector('input.password').type = "password"
	}
}

let passStrengthIndicator = {

	dom: document.querySelector("#register-main .strength"),

	show: function() {
		this.dom.classList.remove("hidden")
	},

	hide: function() {
		this.dom.classList.add("hidden")
		this.dom.querySelectorAll(".bar").forEach(function(bar) {
			bar.classList.remove("active")
		})
	},

	setStrength: function(level) {
		let self = this
		this.show()
		setTimeout(() => {
			if (level === 0) {

				if (this.dom.querySelector(".bar-2").classList.contains("active")) {

					this.dom.querySelector(".bar-2").classList.remove("active")
					setTimeout(() => {
						this.dom.querySelector(".bar-1").classList.remove("active")
					}, 300);

				} else if (this.dom.querySelector(".bar-1").classList.contains("active")) {

					this.dom.querySelector(".bar-1").classList.remove("active")

				} else if (this.dom.querySelector(".bar-0").classList.contains("active")) {

				} else {

					this.dom.querySelector(".bar-0").classList.add("active")

				}
			} else if (level === 1) {

				if (this.dom.querySelector(".bar-2").classList.contains("active")) {

					this.dom.querySelector(".bar-2").classList.remove("active")

				} else if (this.dom.querySelector(".bar-1").classList.contains("active")) {

				} else if (this.dom.querySelector(".bar-0").classList.contains("active")) {

					this.dom.querySelector(".bar-1").classList.add("active")

				} else {

					this.dom.querySelector(".bar-0").classList.add("active")
					setTimeout(() => {
						this.dom.querySelector(".bar-1").classList.add("active")
					}, 300);

				}

			} else if (level === 2) {

				if (this.dom.querySelector(".bar-2").classList.contains("active")) {

					

				} else if (this.dom.querySelector(".bar-1").classList.contains("active")) {

					this.dom.querySelector(".bar-2").classList.add("active")

				} else if (this.dom.querySelector(".bar-0").classList.contains("active")) {

					this.dom.querySelector(".bar-1").classList.add("active")
					setTimeout(() => {
						this.dom.querySelector(".bar-2").classList.add("active")
					}, 300);

				} else {

					this.dom.querySelector(".bar-0").classList.add("active")
					setTimeout(() => {
						this.dom.querySelector(".bar-1").classList.add("active")
						setTimeout(() => {
							this.dom.querySelector(".bar-2").classList.add("active")
						}, 300);
					}, 300);

				}

			}

		}, 200);
	}

}