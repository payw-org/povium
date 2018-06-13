class RegisterView {
	constructor() {

		// DOM selection
		this.userNameDOM = document.querySelector("input.username");
		this.userEmailDOM = document.querySelector("input.email");
		this.userPasswordDOM = document.querySelector("input.password");

		// Event listeners
		this.userNameDOM.addEventListener("focusout", function() {
			var r = new XMLHttpRequest();
			r.open("POST", "", true);
		})

	}
}

class RegisterController {
	constructor() {
		this.registerView = new RegisterView();
	}
}

let registerController = new RegisterController();

