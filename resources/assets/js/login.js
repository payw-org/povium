// 로그인 받을 때
// array('email' => '', 'password' => '', 'remember' => bool);
// 로그인 리턴할 때
// array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url');

import TextInput from "./TextInput";
import AJAX from "./AJAX";

class SignInInput extends TextInput {

	constructor (inputDOM) {
		super(inputDOM);
	}

}

var identifierInputDOM = document.querySelector('.input-wrapper.identifier input');
var passInputDOM = document.querySelector('.input-wrapper.password input');
var rememberCheckBox = document.querySelector('#auto-chk');

if (identifierInputDOM) {
	var identifierInputObj = new SignInInput(identifierInputDOM);
	var passInputObj = new SignInInput(passInputDOM);
}

var confirmButton = document.querySelector("button.confirm");
confirmButton.addEventListener("click", function() {

	var inputData = {
		identifier: identifierInputDOM.value,
        password: passInputDOM.value,
        remember: rememberCheckBox.checked
	}

	var ajax = new AJAX();
	ajax.chirp({
		type: "post",
		url: "/login",
		data: "login_inputs=" + JSON.stringify(inputData),
		success: function(response) {
			var result = JSON.parse(response);
			console.log(response);
			if (result['err']) {
				alert(result['msg']);
			} else {
                window.location.replace(result['redirect']);

			}
		}
	});
});
