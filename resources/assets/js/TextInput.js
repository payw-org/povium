export default class TextInput {

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
