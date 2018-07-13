import DOMManager from "./DOMManager";
import SelectionManager from "./SelectionManager";

export default class PostEditor {

	/**
	 * Creates a new PostEditor object.
	 * @param {HTMLElement} editorDOM
	 */
	constructor (editorDOM) {

		let self = this;

		this.domManager = new DOMManager(editorDOM);
		this.selManager = new SelectionManager(this.domManager);

		this.mouseDownStart = false;

		document.execCommand("defaultParagraphSeparator", false, "p");

		// Event Listeners

		this.domManager.editor.addEventListener('click', () => { this.onSelectionChanged(); });

		this.domManager.editor.addEventListener('mousedown', () => {
			this.mouseDownStart = true;
		});
		window.addEventListener('mouseup', () => {
			if (this.mouseDownStart) {
				this.mouseDownStart = false;
				// this.onSelectionChanged();
			}
			
		});


		this.isBackspaceKeyPressed = false;

		window.addEventListener('keydown', (e) => {
			this.onKeyDown(e);
			this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('keyup', (e) => {
			this.onKeyUp(e);
			
			this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('keypress', (e) => {
			this.onKeyPress(e);
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

		this.domManager.alignLeft.addEventListener('click', (e) => { this.selManager.align('left'); });
		this.domManager.alignCenter.addEventListener('click', (e) => { this.selManager.align('center'); });
		this.domManager.alignRight.addEventListener('click', (e) => { this.selManager.align('right'); });

		this.domManager.orderedList.addEventListener('click', (e) => { this.selManager.list('OL'); });
		// this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('UL'); });
		this.domManager.blockquote.addEventListener('click', (e) => { this.selManager.blockquote('UL'); });

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


	onKeyPress (e) {

	}

	/**
	 * Fires when press keyboard inside the editor.
	 * @param {KeyboardEvent} e 
	 */
	onKeyUp (e) {
		var currentNode = this.selManager.getNodeInSelection();
		if (currentNode && currentNode.textContent !== "" && currentNode.querySelector("br")) {
			currentNode.removeChild(currentNode.querySelector("br"));
		}
	}

	onKeyDown (e) {

		var sel = window.getSelection();
		if (sel.rangeCount > 0) {
			if (!this.domManager.editor.contains(sel.getRangeAt(0).startContainer)) {
				console.warn("The given range is not in the editor. Editor's features will work only inside the editor.");
				return;
			}
		}

		var keyCode = e.which;

		// Delete key
		if (keyCode === 8) {

			this.selManager.backspace(e);

		} else if (keyCode === 46) {
			console.log("delete");
			this.selManager.delete(e);
		} else if (keyCode === 13) {

			this.selManager.enter(e);
			
		}
		
	}


	onSelectionChanged () {

		// console.log('selection has been changed');

		
		this.selManager.fixSelection();		

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
		document.getSelection().removeAllRanges();

		// if (this.isEmpty()) {
		// 	this.domManager.editor.innerHTML = "";
		// 	var emptyP = this.domManager.generateEmptyParagraph('p');
		// 	this.domManager.editor.appendChild(emptyP);

		// 	var range = document.createRange();
		// 	range.setStartBefore(emptyP);
		// 	range.collapse(true);

		// 	this.selManager.sel.removeAllRanges();
		// 	this.selManager.sel.addRange(range);
		// }
		
	}

	clearEditor () {

		this.domManager.editor.innerHTML = "";

	}
	

	/**
	 * Return true if the editor is empty.
	 */
	isEmpty () {
		let contentInside = this.domManager.editor.textContent;
		let childNodesCount = this.selManager.getAllNodesInSelection().length;
		if (contentInside === "" && childNodesCount < 1) {
			return true;
		} else {
			return false;
		}
	}

}
