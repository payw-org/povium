import TextInput from "./TextInput";
import AJAX from "./AJAX";

class RegInput extends TextInput {

	constructor (inputDOM) {
		super(inputDOM);

		var self = this;

		this.target.addEventListener('keyup', function () {

			clearTimeout(this.wait);

			var inputData = self.target.value;

			if (inputData === "") {
				self.hideMsg();
				return;
			}

			this.wait = setTimeout(function () {
				checkValidation();
			}, 300);

		});

		this.target.addEventListener('focusout', function () {
			// console.log('focused out');
		});
	}

}

var emailInputDOM = document.querySelector('.input-wrapper.email input');
var nameInputDOM = document.querySelector('.input-wrapper.name input');
var passInputDOM = document.querySelector('.input-wrapper.password input');

if (emailInputDOM) {
	var emailInputObj = new RegInput(emailInputDOM);
	var nameInputObj = new RegInput(nameInputDOM);
	var passInputObj = new RegInput(passInputDOM);
}


function checkValidation () {

	console.log('checking validation...');

	var inputData = {
		email: emailInputDOM.value,
		name: nameInputDOM.value,
		password: passInputDOM.value
	}

	var ajax = new AJAX();
	ajax.chirp({
		type: "post",
		url: "/test.php",
		data: "register_inputs=" + JSON.stringify(inputData),
		success: function (response) {
			var result = JSON.parse(response);

			console.log(result);

			if (result['err']) {
				emailInputObj.showMsg(result['email_msg']);
				nameInputObj.showMsg(result['name_msg']);
				passInputObj.showMsg(result['password_msg']);
			} else {
				emailInputObj.hideMsg();
				nameInputObj.hideMsg();
				passInputObj.hideMsg();
			}
		}
	});

}
