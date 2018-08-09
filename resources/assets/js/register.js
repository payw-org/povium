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
			var result = JSON.parse(response)

			// console.log(result)

			if (result['err']) {
				readableIDInputObj.showMsg(result['readable_id_msg'])
				nameInputObj.showMsg(result['name_msg'])
				passInputObj.showMsg(result['password_msg'])
			} else {
				readableIDInputObj.hideMsg()
				nameInputObj.hideMsg()
				passInputObj.hideMsg()
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
			if (result['err']) {
				alert("입력 정보에 문제가 있어요.")
			} else {
				window.location.replace(result['redirect'])
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