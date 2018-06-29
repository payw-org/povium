
// input.js
document.querySelectorAll(".input-wrapper").forEach(function(self, index) {

	self.addEventListener("focusin", function() {
		this.classList.add("focused");
	});

	self.addEventListener("focusout", function() {
		this.classList.remove("focused");
		if (this.querySelector("input").value !== "") {
			this.classList.add("fixed");
		} else {
			this.classList.remove("fixed");
		}
	});
	
});

class TextInput {

	/**
	 * 
	 * @param {HTMLElement} inputDOM 
	 */
	constructor (inputDOM) {
		this.target = inputDOM;
		console.log(this.target);
	}

	showError (message) {
		console.log('message');
		if (this.target.parentNode.querySelector('.expanded-box') || this.target.value === "") {
			console.log('no');
			return;
		} else {
			let errorMsgBox = document.createElement('div');
			errorMsgBox.className = 'expanded-box error-msg-box collapsed';
			errorMsgBox.innerHTML = message;
			this.target.classList.add('expanded');
			this.target.parentNode.appendChild(errorMsgBox);

			errorMsgBox.classList.remove('collapsed');
			errorMsgBox.classList.add('collapsing');
			errorMsgBox.classList.remove('collapsing');
		}

	}

}




// ajax.js
class AJAX {

	constructor () {

		this.httpRequest = new XMLHttpRequest();

		if (window.XMLHttpRequest) { // Firefox, Safari, Chrome
			this.httpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 8 and over
			this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}

	}

	/**
	 * 
	 * @param {Object} config
	 */
	chirp (config) {
		/*
		send type, uri, data, success function, fail function
		*/

		var type = "get", uri = "", data = "", success, fail, done;

		if ("type" in config) {
			type = config["type"];
		}

		type = type.toLowerCase();

		if ("uri" in config) {
			uri = config["uri"];
		} else {
			console.error("You didn't provide an uri for AJAX call.");
			return;
		}

		if ("data" in config) {
			data = config["data"];
		}

		if ("success" in config) {

			success = config["success"];
			
			if (typeof success !== "function") {
				console.error(success, "is not a function.");
				return;
			}
		}

		if ("fail" in config) {

			fail = config["fail"];

			if (typeof fail !== "function") {
				console.error(fail, "is not a function.");
				return;
			}
		}

		if ("done" in config) {
			done = config["done"];

			if (typeof done !== "function") {
				console.error(done, "is not a function.");
				return;
			}
		}


		this.httpRequest.addEventListener('readystatechange', function () {
			if (this.readyState === 4) {

				if (done) {
					done();
				}

				if (this.status === 200) {
					let response = this.responseText;
					if (success) {
						success(response);
					}
					
				} else {
					if (fail) {
						fail();
					}
					
				}
			}
		});

		this.httpRequest.open(type, uri, true);
		if (type === "post") {
			this.httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		this.httpRequest.send(data);

	}

}