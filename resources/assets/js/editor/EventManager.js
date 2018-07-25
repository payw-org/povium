import DOMManager from "./DOMManager";
import PostEditor from "./PostEditor";
import SelectionManager from "./SelectionManager";
import UndoManager from "./UndoManager";

export default class EventManager
{

	/**
	 * 
	 * @param {PostEditor} postEditor 
	 * @param {DOMManager} domManager 
	 * @param {SelectionManager} selManager
	 * @param {UndoManager} undoManager
	 */
	constructor(postEditor, domManager, selManager, undoManager)
	{

		// Properties
		let self = this;

		// Event Listeners

		this.mouseDownStart = false;

		this.postEditor = postEditor;
		this.domManager = domManager;
		this.selManager = selManager;
		this.ssManager = undoManager;

		this.linkRange = document.createRange();


		// Event Listeners
		window.addEventListener('click', (e) => {
			// console.log(e.target);
			// if (e.target.nodeName === "INPUT" && e.target.parentNode.classList.contains("pack")) {
			// 	return;
			// } else {
			// 	this.onSelectionChanged();
			// }
		});
		this.domManager.editor.addEventListener('mousedown', (e) => {
			this.domManager.hidePopTool();
			this.mouseDownStart = true;
		});
		this.domManager.editor.addEventListener('touchstart', (e) => {
			this.domManager.hidePopTool();
			this.mouseDownStart = true;
		});
		this.domManager.editor.addEventListener('mouseup', (e) => {
			this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('touchend', (e) => {
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
		window.addEventListener('touchend', (e) => {
			if (this.mouseDownStart) {
				this.mouseDownStart = false;
				this.onSelectionChanged();
			}
		});


		this.isBackspaceKeyPressed = false;

		this.domManager.editor.addEventListener('keydown', (e) => {
			this.onKeyDown(e);
			this.onSelectionChanged();
		});
		window.addEventListener('keydown', (e) => {
			if (e.which === 90 && e.ctrlKey) {
				e.preventDefault();
				this.ssManager.undo();
			}
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
		// document.querySelector("#pt-p").addEventListener('click', (e) => { this.selManager.heading('P'); });
		document.querySelector("#pt-h1").addEventListener('click', (e) => { this.selManager.heading('H1'); });
		document.querySelector("#pt-h2").addEventListener('click', (e) => { this.selManager.heading('H2'); });
		document.querySelector("#pt-h3").addEventListener('click', (e) => { this.selManager.heading('H3'); });
		document.querySelector("#pt-bold").addEventListener('click', (e) => { this.selManager.bold(); });
		document.querySelector("#pt-italic").addEventListener('click', (e) => { this.selManager.italic(); });
		document.querySelector("#pt-underline").addEventListener('click', (e) => { this.selManager.underline(); });
		document.querySelector("#pt-strike").addEventListener('click', (e) => { this.selManager.strike(); });
		document.querySelector("#pt-alignleft").addEventListener('click', (e) => { this.selManager.align('left'); });
		document.querySelector("#pt-alignmiddle").addEventListener('click', (e) => { this.selManager.align('center'); });
		document.querySelector("#pt-alignright").addEventListener('click', (e) => { this.selManager.align('right'); });

		document.querySelector("#pt-title-pack").addEventListener('click', (e) => {

			document.querySelector("#poptool .top-categories").classList.add("hidden");
			document.querySelector("#poptool .title-style").classList.remove("hidden");
			this.domManager.showPopTool();

		});

		document.querySelector("#pt-textstyle-pack").addEventListener('click', (e) => {

			document.querySelector("#poptool .top-categories").classList.add("hidden");
			document.querySelector("#poptool .text-style").classList.remove("hidden");
			this.domManager.showPopTool();

		});

		document.querySelector("#pt-align-pack").addEventListener('click', (e) => {

			document.querySelector("#poptool .top-categories").classList.add("hidden");
			document.querySelector("#poptool .align").classList.remove("hidden");
			this.domManager.showPopTool();

		});

		document.querySelector("#pt-link").addEventListener('click', (e) => {

			document.querySelector("#poptool .top-categories").classList.add("hidden");
			document.querySelector("#poptool .input").classList.remove("hidden");
			this.domManager.showPopTool();

			this.linkRange = this.selManager.getRange();

			setTimeout(() => {
				document.querySelector("#poptool .pack.input input").focus();
			}, 0);
			
		});

		document.querySelector("#pt-blockquote").addEventListener('click', (e) => {

			this.selManager.blockquote();

		});

		document.querySelectorAll("#poptool .pack button").forEach(function(elm) {
			elm.addEventListener('click', function() {
				self.domManager.showPopTool();
			});
			
		});

		document.querySelector("#poptool .pack.input input").addEventListener("keydown", function(e) {
			if (e.which === 13) {
				e.preventDefault();
				self.domManager.hidePopTool();
				self.selManager.replaceRange(self.linkRange);
				self.selManager.link(this.value);
				setTimeout(() => {
					this.value = "";
				}, 200);
				
			}
		});


		// Disable link by click
		this.domManager.editor.addEventListener('mousedown', function(e) {
			if (e.target.closest("a")) {
				self.selManager.unlink(e.target.closest("a"));
				self.domManager.hidePopTool();
			}
		});
		this.domManager.editor.addEventListener('touchstart', function(e) {
			console.log(e.target);
			console.log(e.target.closest("a"));
			if (e.target.closest("a")) {
				self.selManager.unlink(e.target.closest("a"));
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

			} else if (e.target.nodeName === "INPUT" && e.target.parentNode.classList.contains('pack')) {

				// console.log("clicked poptool input");

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
			console.log('removed br');
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

	/**
	 * 
	 * @param {KeyboardEvent} e 
	 */
	onKeyDown (e) {

		var sel = window.getSelection();
		if (sel.rangeCount > 0) {
			if (!this.domManager.editor.contains(sel.getRangeAt(0).startContainer)) {
				// console.warn("The given range is not in the editor. Editor's features will work only inside the editor.");
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

		} else if (keyCode === 90 && e.ctrlKey) {

			// e.preventDefault();
			// this.ssManager.undo();

		} else if (
			keyCode !== 8 && keyCode !== 9 && keyCode !== 13 && keyCode !== 16 && keyCode !== 17 &&
			keyCode !== 18 && keyCode !== 19 && keyCode !== 20 && keyCode !== 27 && keyCode !== 32 &&
			keyCode !== 33 && keyCode !== 34 && keyCode !== 35 && keyCode !== 36 && keyCode !== 37 &&
			keyCode !== 38 && keyCode !== 39 && keyCode !== 40 && keyCode !== 45 && keyCode !== 46 &&
			keyCode !== 91 && keyCode !== 219 && keyCode !== 92 && keyCode !== 220 && keyCode !== 93 &&
			keyCode !== 144 && keyCode !== 145 
		) {
			if (window.getSelection().rangeCount > 0 && !window.getSelection().getRangeAt(0).collapsed) {
				this.selManager.removeSelection("end");
				this.selManager.backspace(document.createEvent("KeyboardEvent"));
			}
		}

	}


	onSelectionChanged () {


		this.selManager.fixSelection();

		setTimeout(() => {
			this.domManager.togglePopTool();
		}, 0);

	}

}