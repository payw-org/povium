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

	/**
	 * 
	 * @param  {String} tagName
	 * @return {HTMLElement}
	 */
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
			this.onKeyUp(e);
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

		this.domManager.orderedList.addEventListener('click', (e) => { this.selManager.list('OL'); });
		this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('UL'); });

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
	 * Fires when press keyboard inside the editor.
	 * @param {KeyboardEvent} e 
	 */
	onKeyUp (e) {
		
	}


	onSelectionChanged () {

		if (this.isEmpty()) {

			console.log('what');
			this.clearEditor();
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

		// Fix flickering when add text style first time
		// in Chrome browser.
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

	clearEditor () {

		this.domManager.editor.innerHTML = "";

	}
	

	/**
	 * Return true if the editor is empty.
	 */
	isEmpty () {
		let contentInside = this.domManager.editor.textContent;
		let childNodesCount = this.selManager.getNodesInSelection().length;
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
		
		let chunks = this.getNodesInSelection();
		let startNode = this.getRange().startContainer;
		let startOffset = this.getRange().startOffset;
		let endNode = this.getRange().endContainer;
		let endOffset = this.getRange().endOffset;

		for (var i = 0; i < chunks.length; i++) {

			if (chunks[i].nodeName === type) {
				continue;
			}

			if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
				console.log('the node is not a paragraph nor heading.')
				continue;
			}

			let newParagraph = document.createElement(type);
			
			var child;
			while (child = chunks[i].firstChild) {
				newParagraph.appendChild(child);
			}

			this.domManager.editor.replaceChild(newParagraph, chunks[i]);

		}

		var keepRange = document.createRange();
		keepRange.setStart(startNode, startOffset);
		keepRange.setEnd(endNode, endOffset);

		this.replaceRange(keepRange);

	}

	/**
	 * 
	 * @param {string} type 
	 */
	list (type) {

		// If one or more lists are
		// included in the selection,
		// add other chunks to the existing list.

		// If all selection is already a list
		// restore them to 'P' node.

		let chunks = this.getNodesInSelection();
		let listDOM = document.createElement(type);

		for (var i = 0; i < chunks.length; i++) {

			if (chunks[i].nodeName === type) {

				return;

			} else {



			}

		}

		var keepRange = document.createRange();
		keepRange.setStart(startNode, startOffset);
		keepRange.setEnd(endNode, endOffset);

		this.replaceRange(keepRange);

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
		range = this.getRange();

		splitted.forEach( (paragraph, index) => {

			var addedNode;

			var line = paragraph;

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


	}

	fixSelection () {
		
		
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
	 * Determine if the given node is a paragraph node which Povium understands.
	 * @param {Node} node
	 */
	isParagraph (node) {
		if (!node) {
			return false;
		} else if (node.nodeName === 'P') {
			return true;
		} else {
			return false;
		}
	}

	isHeading (node) {
		if (!node) {
			return false;
		} else if (
			node.nodeName === 'H1' ||
			node.nodeName === 'H2' ||
			node.nodeName === 'H3' ||
			node.nodeName === 'H4' ||
			node.nodeName === 'H5' ||
			node.nodeName === 'H6'
		) {
			return true;
		} else {
			return false;
		}
	}

	isList (node) {
		if (!node) {
			return false;
		} else if (
			node.nodeName === 'OL' ||
			node.nodeName === 'UL'
		) {
			return true;
		} else {
			// console.warn(node);
			return false;
		}
	}

	isBlockquote (node) {
		if (!node) {
			return false;
		} else if (node.nodeName === 'BLOCKQUOTE') {
			return true;
		} else {
			// console.warn(node);
			return false;
		}
	}

	isAvailableNode (node) {
		if (
			this.isParagraph(node) ||
			this.isHeading(node) ||
			this.isList(node) ||
			this.isBlockquote(node)
		) {
			return true;
		} else {
			return false;
		}
	}




	// Getters


	/**
	 * @return {Selection}
	 */
	getSelection () {
		return this.sel;
	}

	
	/**
	 * @return {Range}
	 */
	getRange () {
		if (document.getSelection().rangeCount > 0) {
			return document.getSelection().getRangeAt(0);
		} else {
			return null;
		}
	}

	/**
	 * Returns an array of all available nodes within the selection.
	 * @return {Array.<HTMLElement>}
	 */
	getNodesInSelection () {

		let travelNode = this.getRange() ? this.getRange().startContainer : null;
		let nodes = [];

		while (1) {
			if (travelNode.nodeName === 'BODY' || travelNode.id === 'editor-body') {
				break;
			} else if (this.isAvailableNode(travelNode)) {
				nodes.push(travelNode);
				
				if (travelNode.contains(this.getRange().endContainer)) {
					break;
				} else {
					travelNode = travelNode.nextElementSibling;
				}

			} else if (travelNode.nextElementSibling === null) {
				travelNode = travelNode.parentNode;
			} else {
				travelNode = travelNode.nextElementSibling;
			}
		}

		return nodes;

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