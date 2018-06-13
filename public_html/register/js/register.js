class RegisterView {
	constructor() {

		// DOM selection
		this.userNameDOM = document.querySelector("input.username");
		this.userEmailDOM = document.querySelector("input.email");
		this.userPasswordDOM = document.querySelector("input.password");

		// Event listeners
		this.userNameDOM.addEventListener("focusout", function() {
			
		})

	}
}

class RegisterController {
	constructor() {
		this.registerView = new RegisterView();
	}
}

let registerController = new RegisterController();


// 'regexp' => [
// 	'userid_regexp' => '/^[a-z0-9-]{3,40}$/',
// 	'userpw_regexp' => '/^\S*(?=\S{8,50})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])\S*$/'
// ],
