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

		document.execCommand("defaultParagraphSeparator", false, "p");

		// Event Listeners

		this.domManager.editor.addEventListener('focusin', () => { this.onSelectionChanged(); });
		this.domManager.editor.addEventListener('keydown', (e) => { this.onKeyDown(e); });
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

		this.domManager.alignLeft.addEventListener('click', (e) => { this.selManager.align('left'); });
		this.domManager.alignCenter.addEventListener('click', (e) => { this.selManager.align('center'); });
		this.domManager.alignRight.addEventListener('click', (e) => { this.selManager.align('right'); });

		this.domManager.orderedList.addEventListener('click', (e) => { this.selManager.list('OL'); });
		// this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('UL'); });

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

	onKeyDown (e) {
		var keyCode = e.which;

		if (keyCode === 13) {

			// Return key
			var selectionNode = this.selManager.getNodeInSelection();
			var selPosType = this.selManager.getSelectionPosition()

			if (this.selManager.isBlockquote(selectionNode)) {

				if (selPosType === 2) {

					e.stopPropagation();
					e.preventDefault();

					var pElm = this.domManager.generateEmptyNode("P");

					this.domManager.editor.insertBefore(pElm, selectionNode.nextSibling);

					var range = document.createRange();
					range.setStartBefore(pElm.firstChild);
					range.collapse(true);

					this.selManager.replaceRange(range);

				} else if (selPosType === 1) {

					e.stopPropagation();
					e.preventDefault();

					// this.selManager.removeSelection();
					this.selManager.splitTextNode();

				}

			}

			
		}
	}


	onSelectionChanged () {

		// if (this.isEmpty()) {

		// 	console.log('what');
		// 	this.clearEditor();
		// 	var p = this.domManager.generateEmptyParagraph('p');
		// 	var range = document.createRange();
		// 	range.setStart(p, 0);
		// 	this.domManager.editor.appendChild(p);
		// 	this.selManager.replaceRange(range);
		// 	console.log('Oops, editor seems empty. Now reset it to initial stat.');
		
		// }

		// If the selection is not in the available elements
		// adjust it.
		var range = this.selManager.getRange();
		if (!range) {
			return;
		}
		var startNode = range.startContainer;
		var startOffset = range.startOffset;
		var endNode = range.endContainer;
		var endOffset = range.endOffset;

		var target;

		var newRange = document.createRange();
		newRange.setStart(startNode, startOffset);
		newRange.setEnd(endNode, endOffset);

		var isChanged = false;

		if (startNode.id === 'editor-body') {

			target = startNode.firstElementChild;

			for (var i = 0; i < startOffset; i++) {
				target = target.nextElementSibling;
			}


			newRange.setStartBefore(target.firstChild);

			isChanged = true;
			
		}

		if (endNode.id === 'editor-body') {

			target = endNode.firstChild;

			for (var i = 0; i < endOffset - 1; i++) {
				target = target.nextElementSibling;
			}

			newRange.setEndAfter(target.lastChild);

			isChanged = true;
			
		}


		if (isChanged) {
			this.selManager.replaceRange(newRange);
			console.log(newRange);
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
