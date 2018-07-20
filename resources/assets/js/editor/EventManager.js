import DOMManager from "./DOMManager";
import PostEditor from "./PostEditor";
import SelectionManager from "./SelectionManager";

export default class EventManager
{

	/**
	 * 
	 * @param {PostEditor} postEditor 
	 * @param {DOMManager} domManager 
	 * @param {SelectionManager} selManager 
	 */
	constructor(postEditor, domManager, selManager)
	{

		let self = this;

		// Event Listeners

		this.mouseDownStart = false;

		this.postEditor = postEditor;
		this.domManager = domManager;
		this.selManager = selManager;

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

		// Image click event
		window.addEventListener('click', (e) => {
			if (e.target.nodeName === "FIGURE") {
				console.log("image clicked");
				e.target.classList.add("selected");
			} else {
				if (this.domManager.editor.querySelector(".selected")) {
					this.domManager.editor.querySelector(".selected").classList.remove("selected");
				}
				
			}
		});

		// disable images contenteditable false
		var imgs = document.getElementsByTagName("figure");
		for (var i = 0; i < imgs.length; ++i) {
					imgs[i].contentEditable = false;
		}
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

}