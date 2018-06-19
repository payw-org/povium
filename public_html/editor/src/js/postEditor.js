class Snapshot {

	constructor () {

	}

	recordSnapshot () {

	}

	revertToSnapshot () {

	}

}

class DOMManager {

	/**
	 * Manages html DOM.
	 * @param {HTMLElement} editorDOM
	 */
	constructor (editorDOM) {

		this.pHolder = document.createElement('p');
		this.pHolder.innerHTML = '<br>';

		// Editor body
		this.editor = editorDOM.querySelector('#editor-body');

		// Toolbar
		this.toolbar = editorDOM.querySelector('#editor-toolbar');

		// Toolbar buttons
		this.body = this.toolbar.querySelector('#p');
		this.heading1 = this.toolbar.querySelector('#h1');
		this.heading2 = this.toolbar.querySelector('#h2');
		this.heading3 = this.toolbar.querySelector('#h3');

		this.boldButton = this.toolbar.querySelector('#bold');
		this.italicButton = this.toolbar.querySelector('#italic');
		this.underlineButton = this.toolbar.querySelector('#underline');
		this.strikeButton = this.toolbar.querySelector('#strike');

		this.alignLeft = this.toolbar.querySelector('#align-left');
		this.alignCenter = this.toolbar.querySelector('#align-center');
		this.alignRight = this.toolbar.querySelector('#align-right');

		this.orderedList = this.toolbar.querySelector('#ol');
		this.unorderedList = this.toolbar.querySelector('#ul');

		this.link = this.toolbar.querySelector('#link');

	}

	generateEmptyParagraph (tagName) {
		let elm = document.createElement(tagName);
		let br = document.createElement('br');
		elm.appendChild(br);
		return elm;
	}

}

class PostEditor {

	/**
	 * Creates a new PostEditor object.
	 * @param {HTMLElement} editorDOM
	 */
	constructor (editorDOM) {

		let self = this;

		this.domManager = new DOMManager(editorDOM);
		this.selManager = new SelectionManager(this.domManager);

		document.execCommand("defaultParagraphSeparator", false, "p");

		// Event Listeners

		this.domManager.editor.addEventListener('focusin', () => { this.onSelectionChanged(); });
		this.domManager.editor.addEventListener('keyup', (e) => {
			this.onKeyDown(e);
			this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('click', () => {
			this.onSelectionChanged();
		});

		this.domManager.editor.addEventListener('paste', (e) => { this.onPaste(e); });

		// Toolbar button events
		this.domManager.body.addEventListener('click', (e) => { this.selManager.heading('P'); });
		this.domManager.heading1.addEventListener('click', (e) => { this.selManager.heading('H1'); });
		this.domManager.heading2.addEventListener('click', (e) => { this.selManager.heading('H2'); });
		this.domManager.heading3.addEventListener('click', (e) => { this.selManager.heading('H3'); });

		this.domManager.boldButton.addEventListener('click', (e) => { this.selManager.bold(); });
		this.domManager.italicButton.addEventListener('click', (e) => { this.selManager.italic(); });
		this.domManager.underlineButton.addEventListener('click', (e) => { this.selManager.underline(); });
		this.domManager.strikeButton.addEventListener('click', (e) => { this.selManager.strike(); });

		this.domManager.alignLeft.addEventListener('click', (e) => { this.selManager.align('justifyLeft'); });
		this.domManager.alignCenter.addEventListener('click', (e) => { this.selManager.align('justifyCenter'); });
		this.domManager.alignRight.addEventListener('click', (e) => { this.selManager.align('justifyRight'); });

		this.domManager.orderedList.addEventListener('click', (e) => { this.selManager.list('ol'); });
		this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('ul'); });

		this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('ul'); });

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

		this.selManager.paste(pastedData);

	}


	/**
	 * 
	 * @param {KeyboardEvent} e 
	 */
	onKeyDown (e) {
		// if (e) {
		// 	if (e.which === 8 || e.which === 46 || e.which === 13) {
		// 		e.stopPropagation();
		// 		e.preventDefault();

		// 		// Backspace key
		// 		if (e.which === 8) {
		// 			this.selManager.backspace();
		// 		}

		// 		// Delete key
		// 		if (e.which === 46) {
		// 			this.selManager.delete();
		// 		}

		// 		// Return key
		// 		if (e.which === 13) {
		// 			this.selManager.enter();
		// 		}
		// 	}
		// }
	}


	onSelectionChanged () {

		this.selManager.updateSelection();

		if (this.isEmpty()) {
			// this.initEditor();
			var p = this.domManager.generateEmptyParagraph('p');
			var range = document.createRange();
			range.setStart(p, 0);
			this.domManager.editor.appendChild(p);
			this.selManager.replaceRange(range);
			console.log('Oops, editor seems empty. Now reset it to initial stat.');
		}

	}


	// Methods

	/**
	 * Initialize editor.
	 */
	initEditor () {

		var emptyNode = document.createElement('p');
		emptyNode.innerHTML = 'a';
		emptyNode.style.opacity = '0';
		this.domManager.editor.appendChild(emptyNode);
		var range = document.createRange();
		range.setStart(emptyNode.firstChild, 0);
		range.setEnd(emptyNode.firstChild, 1);
		this.selManager.replaceRange(range);
		document.execCommand('bold', false);
		this.domManager.editor.removeChild(emptyNode);

		if (this.isEmpty()) {
			this.domManager.editor.innerHTML = "";
			var emptyP = this.domManager.generateEmptyParagraph('p');
			this.domManager.editor.appendChild(emptyP);

			var range = document.createRange();
			range.setStartBefore(emptyP);
			range.collapse(true);

			this.selManager.sel.removeAllRanges();
			this.selManager.sel.addRange(range);
		}
		
	}
	

	/**
	 * Return true if the editor is empty.
	 */
	isEmpty () {
		let contentInside = this.domManager.editor.textContent;
		let childNodesCount = this.domManager.editor.childElementCount;
		if (contentInside === "" && childNodesCount < 1) {
			return true;
		} else {
			return false;
		}
	}

}

class SelectionManager {

	/**
	 * 
	 * @param {DOMManager} domManager 
	 */
	constructor (domManager) {

		this.sel = document.getSelection();
		this.range;
		this.startNode;
		this.startOffset;
		this.endNode;
		this.endOffset;

		this.domManager = domManager;

	}

	// Events



	// Methods

	/**
	 * Align the selected paragraph.
	 * @param {String} direction
	 * justifyLeft, justifyCenter, justifyRight
	 */
	align (direction) {
		document.execCommand(direction, false);
	}


	/**
	 * Make the selection bold.
	 */
	bold () {
		document.execCommand('bold', false);
	}

	/**
	 * Make the selection italics.
	 */
	italic () {
		document.execCommand('italic', false);
	}

	underline () {
		document.execCommand('underline', false);
	}

	strike () {
		document.execCommand('strikeThrough', false);
	}

	/**
	 * 
	 * @param {string} type 
	 */
	heading (type) {
		type = type.toUpperCase();
		document.execCommand('formatBlock', false, '<'+type+'>');
	}

	/**
	 * 
	 * @param {string} type 
	 */
	list (type) {
		type = type.toLowerCase();
		if (type === 'ol') {
			document.execCommand('insertOrderedList', false);
		} else if (type === 'ul') {
		
		}
	}

	link (uri) {
		document.execCommand('createLink', false, uri);
	}



	/**
	 * Deprecated
	 */
	backspace () {

		// this.range.deleteContents();

		// If the selection is collapsed
		// implement default delete action.
		if (this.isEmpty()) {
			console.log(this.startOffset);
			if (this.startOffset === 0) {
				// If the selection is on the beginning
				
			} else {
				if (this.startNode.nodeType === 3) {
					console.log(this.startNode);
					// TextNode
					var text = this.startNode.textContent;
					var suffixNode;
					var newRange = document.createRange();

					this.startNode.textContent
					= text.slice(0, this.startOffset - 1) + text.slice(this.startOffset, text.length);
					
					newRange.setEnd(this.startNode, this.startOffset - 1);
					newRange.collapse(false);
					newRange.insertNode((suffixNode = document.createTextNode(' ')));
					newRange.setStartAfter(suffixNode);

					console.log(this.startOffset);

					this.replaceRange(newRange);
					
				}
			}
		}
		

	}

	delete () {
		
	}

	enter () {

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



	clearRange () {
		this.sel.removeAllRanges();
	}

	/**
	 * 
	 * @param {Range} range 
	 */
	replaceRange (range) {
		this.sel.removeAllRanges();
		this.sel.addRange(range);
	}

	/**
	 * Update selection information.
	 */
	updateSelection () {

		this.sel = document.getSelection();

		// If there is a range
		// update range property.
		if (this.sel.rangeCount > 0) {
			this.range = this.sel.getRangeAt(0);
			this.startNode = this.range.startContainer;
			this.startOffset = this.range.startOffset;
			this.endNode = this.range.endContainer;
			this.endOffset = this.range.endOffset;
		}

		// If the selection is not in the paragraph,
		// move the cursor to the nearest pragraph node.
		console.log(this.startNode);
		console.log(this.endNode);

	}

	fixSelection () {
		if (!this.isInsideParagraph()) {
			this.sel
		}
	}

	splitTextNode () {
		if (this.startOffset > 0) {
			console.log(this.startNode);
		}
	}

	/**
	 * Remove selection.
	 */
	removeSelection () {
		
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

	/**
	 * Returns true if the selection is in multiple paragraphs.
	 * @return {Boolean}
	 */
	isMultiParagraph () {
		if (this.getParagraphNode(this.startNode) === this.getParagraphNode(this.endNode)) {
			return false;
		} else {
			return true;
		}
	}

	isInsideParagraph () {
		if (this.getParagraphNode(this.startNode)) {
			return true;
		} else {
			return false;
		}
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
	 * @param {Node} node
	 * @return {Array}
	 */
	getParagraphNode (node) {
		// Loop nodes
		var travelNode = node;
		while (1) {
			if (!travelNode) {
				return false;
			} else if (travelNode.nodeName === 'BODY') {
				return false;
			} else if (
				travelNode.nodeName === 'H1' ||
				travelNode.nodeName === 'H2' ||
				travelNode.nodeName === 'H3' ||
				travelNode.nodeName === 'P'
			) {
				return travelNode;
			} else {
				travelNode = travelNode.parentNode;
			}
		}
	}

	getCursorPosInParagraph () {
		if (this.startOffset === 0) {
			// If the selection is on the beginning
			return 1;
		} else {
			return
		}
	}

}

const editor = new PostEditor(document.querySelector('#post-editor'));

// var a = document.createElement('h1').nodeName;
// console.log(a);