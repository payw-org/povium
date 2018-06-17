class DOMManager {

	constructor () {

		this.pHolder = document.createElement('p');
		this.pHolder.className = 'p--holder';
		this.pHolder.innerHTML = '<br>';

	}

}

class PostEditor {

	/**
	 * Creates a new PostEditor object.
	 * @param {HTMLElement} editorDOM
	 */
	constructor (editorDOM) {

		let self = this;

		this.sel = new Selection();
		this.dom = new DOMManager();

		this.editor = editorDOM;

		this.editor.addEventListener('keyup', () => { this.onSelectionChanged(); });
		this.editor.addEventListener('focusin', () => { this.onSelectionChanged(); });

		this.initEditor();
	
	}

	// Events

	onSelectionChanged () {

		this.sel.updateSelection();
		
		if (this.isEmpty()) {
			this.initEditor();
		}

	}


	// Methods

	/**
	 * Initialize editor.
	 */
	initEditor () {
		this.editor.innerHTML = "";
		this.editor.appendChild(this.dom.pHolder);
	}

	/**
	 * Return true if the editor is empty.
	 */
	isEmpty () {
		let contentInside = this.editor.textContent;
		let childNodesCount = this.editor.childElementCount;
		if (contentInside === "" && childNodesCount <= 1) {
			console.log('empty editor');
			return true;
		} else {
			return false;
		}
	}

}

class Selection {

	/**
	 * 
	 * @param {Selection} sel
	 */
	constructor () {

		this.sel;
		this.range = document.createRange();
	
	}

	// Events



	// Methods

	/**
	 * Align the selected paragraph.
	 * @param {String} Direction 
	 */
	align (direction) {

	}

	/**
	 * Make the selection bold.
	 */
	bold () {

	}

	/**
	 * Return true if the selection is empty.
	 */
	isEmpty () {

	}

	/**
	 * Make the selection italics.
	 */
	italics () {

	}

	/**
	 * Update selection.
	 */
	updateSelection () {

		this.sel = document.getSelection();
		if (this.sel.rangeCount > 0) {
			this.range = this.sel.getRangeAt(0);
		}
		
	}

}

const editor = new PostEditor(document.querySelector('#editor-body'));