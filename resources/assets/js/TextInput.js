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
