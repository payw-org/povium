export default class TextInput {

	target        : HTMLInputElement
	wrapperElement: HTMLElement

	constructor (inputDOM: HTMLInputElement) {
		
		this.target = inputDOM
		this.wrapperElement = inputDOM.parentElement

		this.target.addEventListener('focusin', () => {
			this.wrapperElement.classList.add('focused')
		})

		this.target.addEventListener('focusout', () => {
			this.wrapperElement.classList.remove('focused')
			if (this.target.value !== '') {
				this.wrapperElement.classList.add('fixed')
			} else {
				this.wrapperElement.classList.remove('fixed')
			}
		})
	}

	showMsg (message: string) {

		if (message === "") {

			this.hideMsg()

			return

		} else if (this.target.value === "") {

			return

		} else if (this.wrapperElement.querySelector('.expanded-box')) {

			this.wrapperElement.querySelector('.expanded-box').innerHTML = message

		} else {
			var errorMsgBox = document.createElement('div')
			errorMsgBox.className = 'expanded-box error-msg-box'
			errorMsgBox.innerHTML = message
			this.target.classList.add('expanded')
			this.wrapperElement.appendChild(errorMsgBox)
		}

		this.wrapperElement.style.paddingBottom = "1.7rem"

	}

	hideMsg () {
		this.wrapperElement.style.paddingBottom = "0px"
	}

}

document.querySelectorAll(".input-wrapper input").forEach(function(self: HTMLInputElement, index) {

	self.addEventListener("keyup", function() {
		
		if (self.value !== "") {
			self.closest('.input-wrapper').classList.add("not-empty")
		} else {
			self.closest('.input-wrapper').classList.remove("not-empty")
		}

	})

})