class GlobalNavView {
	constructor() {
		// Elements
		this.gnDOM = document.querySelector('#globalnav');
		this.gnInputDOM = document.querySelector('#gn-search-input');

		// Attatch event listeners
		window.addEventListener('mousedown', e => this.handleWindowClickEvent(e));
		window.addEventListener('touchstart', e => this.handleWindowClickEvent(e));

		document.querySelector('#globalnav .magnifier').addEventListener('click', e => {
			this.handleMagnifierEvent();
		});

		document.querySelector('#gn-search-input').addEventListener('keyup', e => {
			if (e.which === 27) {
				this.foldSearchInput();
			}
		});

	}

	// Methods
	expandSearchInput() {
		this.gnDOM.classList.add('search-active');
		this.gnInputDOM.focus();
	}

	foldSearchInput() {
		this.gnDOM.classList.remove('search-active');
		this.gnInputDOM.blur();
	}

	// Determine which action should be run
	// when click magnifier icon in global navigation
	handleMagnifierEvent() {
		if (this.gnDOM.classList.contains('search-active')) {
			// Start searching (nothing happens)
		} else {
			this.expandSearchInput();
		}
	}

	handleWindowClickEvent(e) {
		if (!document.querySelector('#gn-search-ui').contains(e.target) &&
		    !document.querySelector('#gn-search-result-view').contains(e.target)
		) {
			this.foldSearchInput();
		}
	}
}

class GlobalNavController {
	constructor() {
		this.globalNavView = new GlobalNavView();
	}
}

window.onload = function() {
	var globalNavController = new GlobalNavController();
};
