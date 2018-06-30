// class RegisterView {
// 	constructor () {
// 		let that = this;

// 		// Event Listeners
// 		document.querySelectorAll('.reg-input').forEach(function (inp) {
// 			inp.addEventListener('keyup', function () {
// 				if (inp.value === "") {
// 					that.removeError(inp);
// 				}
// 			});
// 			inp.addEventListener('focusout', function () {
// 				if (inp.value === "") {
// 					that.removeError(inp);
// 				}
// 			});
// 			inp.addEventListener('focusin', function () {
// 				if (inp.value === "") {
// 					that.removeError(inp);
// 				}
// 			});
// 		})
// 	}

// 	/**
// 	 * [indicateError description]
// 	 * @param  {object} response [description]
// 	 * @return {[type]}          [description]
// 	 */
// 	indicateError (response) {
// 		for (const key in response) {
// 			console.log(key);
// 			this.showError(this.getTargetElmByClass(key), "이미 가입된 이메일입니다.");
// 		}
// 	}

// 	showError (inputTarget, message) {
// 		if (inputTarget.parentNode.querySelector('.expanded-box') || inputTarget.value === "") {
// 			return;
// 		} else {
// 			let errorMsgBox = document.createElement('div');
// 			errorMsgBox.className = 'expanded-box error-msg-box collapsed';
// 			errorMsgBox.innerHTML = message;
// 			inputTarget.classList.add('expanded');
// 			inputTarget.parentNode.insertBefore(errorMsgBox, inputTarget.nextSibling);

// 			errorMsgBox.classList.remove('collapsed');
// 			errorMsgBox.classList.add('collapsing');
// 			errorMsgBox.classList.remove('collapsing');
// 		}

// 	}

// 	removeError (inputTarget) {
// 		if (!inputTarget.parentNode.querySelector('.expanded-box')) {
// 			return;
// 		}
// 		inputTarget.nextSibling.style.height = 0;
// 		inputTarget.nextSibling.style.padding = 0;
// 		setTimeout(function () {
// 			inputTarget.classList.remove('expanded');
// 			inputTarget.parentNode.removeChild(inputTarget.nextSibling);
// 		}, 200);
// 	}

// 	getTargetElmByClass (classname) {
// 		return document.querySelector("input." + classname);
// 	}
// }

// class RegisterModel {
// 	constructor () {
// 		this.email;
// 		this.name;
// 		this.password;
// 	}
// }

// class RegisterController {
// 	constructor () {
// 		this.view  = new RegisterView();
// 		this.model = new RegisterModel();
// 		let that  = this;

// 		// Event Listeners
// 		document.querySelectorAll('.reg-input').forEach(function (inp) {
// 			inp.addEventListener('focusout', function () {
// 				if (inp.value === "") {
// 					return;
// 				} else {
// 					that.verifyUserinfo(that.getUserinfo());
// 				}

// 			})
// 		})
// 	}

// 	/**
// 	 * Verify whether user can use the email or username or password.
// 	 * @param  {object} userInfo [description]
// 	 */
// 	verifyUserinfo (userInfo) {

// 		let that = this;

// 		// AJAX Call
// 		var httpRequest = new XMLHttpRequest();
// 		if (window.XMLHttpRequest) { // Firefox, Safari, Chrome
// 			httpRequest = new XMLHttpRequest();
// 		} else if (window.ActiveXObject) { // IE 8 and over
// 			httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
// 		}

// 		httpRequest.addEventListener('readystatechange', function () {
// 			if (this.readyState === 4) {
// 				if (this.status === 200) {
// 					let responseJSON = this.responseText;
// 					// console.log(responseJSON);
// 					let response = JSON.parse(responseJSON);
// 					that.view.indicateError(response);
// 				}
// 			}
// 		});

// 		httpRequest.open("post", "/test.php", true);
// 		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// 		httpRequest.send("userinfo=" + JSON.stringify(userInfo));
// 	}

// 	getUserinfo () {
// 		let email    = document.querySelector('.email').value;
// 		let name     = document.querySelector('.username').value;
// 		let password = document.querySelector('.password').value;

// 		return {email: email, name: name, password: password};
// 	}
// }

// let registerController = new RegisterController();


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

var emailInputObj = new RegInput(emailInputDOM);
var nameInputObj = new RegInput(nameInputDOM);
var passInputObj = new RegInput(passInputDOM);

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
