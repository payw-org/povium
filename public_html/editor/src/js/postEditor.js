class DOMManager {

	/**
	 * Manages html DOM.
	 * @param {HTMLElement} editorDOM
	 */
	constructor (editorDOM) {

		this.pHolder = document.createElement('p');
		this.pHolder.innerHTML = '<br>';

		this.editor = editorDOM.querySelector('#editor-body');
		this.toolbar = editorDOM.querySelector('#editor-toolbar');
		this.boldButton = this.toolbar.querySelector('#bold');

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
		this.dom = new DOMManager(editorDOM);

		this.dom.editor.addEventListener('focusin', () => { this.onSelectionChanged(); });
		this.dom.editor.addEventListener('keyup', () => { this.onSelectionChanged(); });
		this.dom.editor.addEventListener('keydown', (e) => {
			this.onSelectionChanged();
			this.onKeyDown(e);
		});

		this.dom.editor.addEventListener('paste', (e) => { this.onPaste(e); });

		this.initEditor();

	}

	// Events

	/**
	 *
	 * @param {KeyboardEvent} e
	 */
	onPaste (e) {

		let clipboardData, pastedData;

		e.stopPropagation();
		e.preventDefault();

		// Get data from clipboard and conver
		clipboardData = e.clipboardData || window.clipboardData;
		pastedData = clipboardData.getData('Text');

		this.sel.paste(pastedData);

	}

	onKeyDown (e) {
		if (e) {
			if (e.which === 8 || e.which === 46 || e.which === 13) {
				e.stopPropagation();
				e.preventDefault();

				// Backspace key
				if (e.which === 8) {
					this.sel.backspace();
				}
			}
		}
	}

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
		if (this.isEmpty()) {
			this.dom.editor.innerHTML = "";
			this.dom.editor.appendChild(this.dom.pHolder);
		}
	}

	/**
	 * Return true if the editor is empty.
	 */
	isEmpty () {
		let contentInside = this.dom.editor.textContent;
		let childNodesCount = this.dom.editor.childElementCount;
		if (contentInside === "" && childNodesCount <= 1) {
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

		this.sel = document.getSelection();
		this.range;
		this.startNode;
		this.startOffset;
		this.endNode;
		this.endOffset;

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
	 * Make the selection italics.
	 */
	italics () {

	}



	backspace () {
		if (this.isEmpty()) {
			console.log('empty selection');
		} else {
			this.deleteSelection();
		}
	}

	/**
	 * Paste refined data to the selection.
	 * @param {String} pastedData
	 */
	paste (pastedData) {

		let splitted = pastedData.split(/(?:\r\n|\r|\n)/g);

		var range = document.createRange();
		range = this.range;

		splitted.forEach( (line, index) => {

			var addedNode;

			if (index === 0) {
				// line = line.replace(/\s/g, "&nbsp;");
				addedNode = document.createTextNode(line);
			} else {
				addedNode = document.createElement('p');
				line = line.replace(/\s/g, "&nbsp;");
				if (line === "") {
					line = "<br>";
				}
				addedNode.innerHTML = line;
			}

			range.insertNode(addedNode);

			range.setStartAfter(addedNode);

		});

		// console.log(splitted);

		// pastedData = pastedData.replace(/(?:\r\n|\r|\n)/g, '<br>');

	}

	/**
	 * Update selection.
	 */
	updateSelection () {

		this.sel = document.getSelection();
		if (this.sel.rangeCount > 0) {
			this.range = this.sel.getRangeAt(0);
			this.startNode = this.range.startContainer;
			this.startOffset = this.range.startOffset;
			this.endNode = this.range.endContainer;
			this.endOffset = this.range.endOffset;
		}

	}

	splitTextNode () {
		if (this.startOffset === 0) {

		}
	}

	deleteSelection () {
		this.range.deleteContents();
	}

	/**
	 * Return true if the selection is empty.
	 */
	isEmpty () {
		if (this.sel.isCollapsed) {
			return true;
		} else {
			return false;
		}
	}

	isMultiLine () {

	}


	// Getters

	getSelection () {
		return this.sel;
	}

	getRange () {
		if (this.sel.rangeCount > 0) {
			return this.sel.getRangeAt(0);
		} else {
			return false;
		}
	}

	/**
	 * Returns an array of paragraph nodes inside the selection.
	 * @return {Array}
	 */
	getParagraphNode () {
		// this.range.
	}

}

const editor = new PostEditor(document.querySelector('#post-editor'));
