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

		// Disable link by click
		document.addEventListener('mousedown', function(e) {
			if (e.target.nodeName === "A") {
				e.preventDefault();
				self.selManager.unlink(e.target);
				self.domManager.hidePopTool();
			}
		});

		// Image click event
		window.addEventListener('click', (e) => {
			if (e.target.classList.contains("image-wrapper")) {
				console.log("image clicked");
				e.preventDefault();

				var selectedFigure = this.domManager.editor.querySelector("figure.image-selected");
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected");
				}

				var figure = e.target.parentNode;
				figure.classList.remove("caption-selected");
				figure.classList.add("image-selected");
				this.domManager.showImageTool(e.target);

				if (this.selManager.isTextEmptyNode(figure.querySelector("FIGCAPTION"))) {
					figure.querySelector("FIGCAPTION").innerHTML = "이미지 주석";
				}

				window.getSelection().removeAllRanges();
			} else if (e.target.id === "full" && e.target.nodeName === "BUTTON") {
				var selectedFigure = this.domManager.editor.querySelector("figure.image-selected");
				selectedFigure.classList.add("full");
				this.domManager.hideImageTool();
				setTimeout(() => {
					this.domManager.showImageTool(selectedFigure.querySelector(".image-wrapper"));
				}, 500);
				
			} else if (e.target.id === "normal" && e.target.nodeName === "BUTTON") {
				var selectedFigure = this.domManager.editor.querySelector("figure.image-selected");
				selectedFigure.classList.remove("full");
				this.domManager.hideImageTool();
				setTimeout(() => {
					this.domManager.showImageTool(selectedFigure.querySelector(".image-wrapper"));
				}, 500);
			} else if (e.target.nodeName === "FIGCAPTION") {
				e.target.parentNode.classList.add("caption-selected");
				e.target.parentNode.classList.remove("image-selected");
				this.domManager.hideImageTool();
				if (!e.target.parentNode.classList.contains("caption-enabled")) {
					e.target.innerHTML = "<br>";
				}
			} else {
				var selectedFigure = this.domManager.editor.querySelector("figure.image-selected, figure.caption-selected");
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected");
					selectedFigure.classList.remove("caption-selected");
				}

				this.domManager.hideImageTool();
			}
		});


		window.addEventListener('mousedown', (e) => {
			if (e.target.classList.contains("image-wrapper")) {
				window.getSelection().removeAllRanges();
				e.preventDefault();
			}
		});

		// disable images contenteditable false
		// var imgs = document.getElementsByTagName("figure");
		// for (var i = 0; i < imgs.length; ++i) {
		// 			imgs[i].contentEditable = false;
		// }
	}

	// Events



	/**
	*
	* @param {KeyboardEvent} e
	*/
	onPaste (e) {

		this.pasteDone = false;

		console.log(this.pasteDone);

		console.log("pasting");

		let originalRange = this.selManager.getRange();
		if (!originalRange) {
			return;
		}

		let pasteArea = document.querySelector("#paste-area");
		// let pasteArea = document.createElement("div");


		let range = document.createRange();
		range.setStart(pasteArea, 0);
		range.collapse(true);

		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);

		setTimeout(() => {

			window.getSelection().removeAllRanges();
			window.getSelection().addRange(originalRange);
			this.selManager.removeSelection("start");

			var node, travelNode, nextNode;
			node = pasteArea.firstChild;
			travelNode = pasteArea.firstChild;

			var metTop = false;


			// Loop all node and analyze
			while (1) {
				// if (!node) {
				// 	return;
				// }
				// for (var i = node.attributes.length - 1; i >= 0; i--){
				// 	node.removeAttribute(node.attributes[i].name);
				// }
				// node = node.nextSibling;

				console.log(travelNode);

				if (!travelNode) {
					break;
				} else {

					if (travelNode.attributes) {
						for (var i = travelNode.attributes.length - 1; i >= 0; i--){
							if (
								travelNode.nodeName === "IMG" && travelNode.attributes[i].name === "src"
							) {
								continue;
							}
							travelNode.removeAttribute(travelNode.attributes[i].name);
						}
					}
					

					if (travelNode.firstChild) {
						travelNode = travelNode.firstChild;
					} else if (travelNode.nextSibling) {
						travelNode = travelNode.nextSibling;
					} else {
						while (true) {
							travelNode = travelNode.parentNode;
							if (travelNode === pasteArea) {
								metTop = true;
							}
							if (travelNode.nextSibling) {
								travelNode = travelNode.nextSibling;
								break;
							}
						}
					}
				}

				if (metTop) {
					break;
				}

			}

			// pasteArea.innerHTML = "";

		}, 1);
		

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
		} else if (currentNode && currentNode.textContent === "" && !currentNode.querySelector("br")) {
			currentNode.appendChild(document.createElement("br"));
		}

		if (this.selManager.isImageCaption(currentNode)) {

			if (this.selManager.isTextEmptyNode(currentNode)) {
				currentNode.parentNode.classList.remove("caption-enabled");
			} else {
				currentNode.parentNode.classList.add("caption-enabled");
			}
			
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