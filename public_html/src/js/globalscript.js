
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
		this.wrapperElement = inputDOM.parentElement;
	}

	showMsg (message) {

		if (message === "") {
			
			console.log('no massage');
			this.hideMsg();

			return;

		} else if (this.target.value === "") {

			return;

		} else if (this.wrapperElement.querySelector('.expanded-box')) {

			this.wrapperElement.querySelector('.expanded-box').innerHTML = message;

		} else {
			var errorMsgBox = document.createElement('div');
			errorMsgBox.className = 'expanded-box error-msg-box';
			errorMsgBox.innerHTML = message;
			this.target.classList.add('expanded');
			this.wrapperElement.appendChild(errorMsgBox);
		}

		this.wrapperElement.style.paddingBottom = "1.7rem";

	}

	hideMsg () {
		this.wrapperElement.style.paddingBottom = "0px";
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
		send type, url, data, success function, fail function
		*/

		var type = "post", url = "", data = "", success, fail, done;

		if ("type" in config) {
			type = config["type"];
		}

		type = type.toLowerCase();

		if ("url" in config) {
			url = config["url"];
		} else {
			console.error("You didn't provide an url for AJAX call.");
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

		this.httpRequest.open(type, url, true);
		if (type === "post") {
			this.httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		this.httpRequest.send(data);

	}

}