class GlobalNavView {
	constructor() {
		// Elements
		this.gnDOM = document.querySelector("#globalnav")
		this.gnInputDOM = document.querySelector("#gn-search-input")

		// Attatch event listeners
		// window.addEventListener("mousedown", e => this.handleWindowClickEvent(e))
		// window.addEventListener("touchstart", e => this.handleWindowClickEvent(e))

		document.querySelector("#globalnav .magnifier").addEventListener("click", e => {
				this.handleMagnifierEvent()
			})

		document.querySelector("#gn-search-input").addEventListener("keyup", e => {
			if (e.which === 27) {
				this.foldSearchInput()
			}
		})

		document.querySelector("#globalnav .mobile-btn").addEventListener("click", e => {
			if (this.gnDOM.classList.contains("mobile-menu-active")) {
				this.foldMobileMenu()
			} else {
				this.expandMobileMenu()
			}
		})

		window.addEventListener("resize", e => {
			this.foldMobileMenu()
		})

		this.gnDOM.querySelector("#gn-search-backface").addEventListener("click", e => {
			this.foldMobileMenu()
			this.foldSearchInput()
		})
	}

	// Methods
	expandMobileMenu() {
		let mm = this.gnDOM.querySelector(".mobile-menu")
		let mmNav = mm.querySelector(".mm-nav")
		this.gnDOM.classList.add("mobile-menu-active")
		mm.style.height = mmNav.getBoundingClientRect().height + "px"
	}

	foldMobileMenu() {
		let mm = this.gnDOM.querySelector(".mobile-menu")
		this.gnDOM.classList.remove("mobile-menu-active")
		mm.style.height = ""
	}

	expandSearchInput() {
		this.gnDOM.classList.add("search-active")
		this.gnInputDOM.focus()
		this.foldMobileMenu()
	}

	foldSearchInput() {
		this.gnDOM.classList.remove("search-active")
		this.gnInputDOM.blur()
	}

	// Determine which action should be run
	// when click magnifier icon in global navigation
	handleMagnifierEvent() {
		if (this.gnDOM.classList.contains("search-active")) {
			// Start searching (nothing happens)
		} else {
			this.expandSearchInput()
		}
	}

	handleWindowClickEvent(e) {
	}
}

class GlobalNavController {
	constructor() {
		this.globalNavView = new GlobalNavView()
	}
}

;["load", "pjax:complete"].forEach(eventName => {
	window.addEventListener(eventName, e => {
		if (document.querySelector("#globalnav")) {
			var globalNavController = new GlobalNavController()
		}
	})
})