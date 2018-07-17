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

		window.addEventListener('click', () => {
			this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('mousedown', (e) => {
			this.domManager.hidePopTool();
			this.mouseDownStart = true;
		});
		this.domManager.editor.addEventListener('mouseup', (e) => {
			this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('dragstart', (e) => {
			e.preventDefault();
		});
		this.domManager.editor.addEventListener('drop', (e) => {
			e.preventDefault();
		});
		window.addEventListener('mouseup', (e) => {
			if (this.mouseDownStart) {
				this.mouseDownStart = false;
				this.onSelectionChanged();
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
		this.domManager.paragraph.addEventListener('click', (e) => { this.selManager.heading('P'); });
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
		this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('UL'); });
		this.domManager.link.addEventListener('click', (e) => { this.selManager.link("naver.com"); });
		this.domManager.blockquote.addEventListener('click', (e) => { this.selManager.blockquote(); });

		// PopTool
		document.querySelector("#pt-bold").addEventListener('click', (e) => { this.selManager.bold(); });
		document.querySelector("#pt-italic").addEventListener('click', (e) => { this.selManager.italic(); });
		document.querySelector("#pt-underline").addEventListener('click', (e) => { this.selManager.underline(); });
		document.querySelector("#pt-strike").addEventListener('click', (e) => { this.selManager.strike(); });

		document.addEventListener('mousedown', function(e) {
			if (e.target.nodeName === "A") {
				e.preventDefault();
				self.selManager.unlink(e.target);
				self.domManager.hidePopTool();
			}
		});

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

		if (keyCode === 8) {

			// Backspace
			this.selManager.backspace(e);

		} else if (keyCode === 46) {

			// Delete
			this.selManager.delete(e);

		} else if (keyCode === 13) {

			// Enter(Return)
			this.selManager.enter(e);
			
		}
		
	}


	onSelectionChanged () {

		// console.log('selection has been changed');

		
		this.selManager.fixSelection();
		this.domManager.togglePopTool();

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

		this.domManager.editor.normalize();

		this.domManager.editor.innerHTML = this.domManager.editor.innerHTML.replace(/\r?\n|\r/g, "");

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
