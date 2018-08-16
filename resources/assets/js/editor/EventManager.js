import DOMManager from "./DOMManager"
import PostEditor from "./PostEditor"
import SelectionManager from "./SelectionManager"
import UndoManager from "./UndoManager"
import { StringDiff } from "./StringDiff";
import PRange from "./PRange";

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
		let self = this

		this.mouseDownStart = false

		this.postEditor = postEditor
		this.domManager = domManager
		this.selManager = selManager
		this.undoManager = undoManager

		this.linkRange = document.createRange()

		this.charKeyDownLocked = false

		this.keyDownLocked = false

		this.multipleSpaceLocked = false

		this.selectedAll = false


		// Event Listeners
		window.addEventListener('click', (e) => {
			// console.log(e.target)
			// if (e.target.nodeName === "INPUT" && e.target.parentNode.classList.contains("pack")) {
			// 	return
			// } else {
			// 	this.onSelectionChanged()
			// }
		})
		window.addEventListener('mousedown', (e) => {
			if (!e.target.closest("#poptool")) {
				this.domManager.hidePopTool()
				this.mouseDownStart = true
			}

		})
		window.addEventListener('touchstart', (e) => {
			if (!e.target.closest("#poptool")) {
				this.domManager.hidePopTool()
				this.mouseDownStart = true
			}

		})
		this.domManager.editor.addEventListener('mouseup', (e) => {
			this.onSelectionChanged()
		})
		this.domManager.editor.addEventListener('touchend', (e) => {
			this.onSelectionChanged()
		})
		this.domManager.editor.addEventListener('dragstart', (e) => {
			e.preventDefault()
		})
		this.domManager.editor.addEventListener('drop', (e) => {
			e.preventDefault()
		})
		window.addEventListener('mouseup', (e) => {
			if (this.mouseDownStart) {
				this.mouseDownStart = false
				this.onSelectionChanged()
			}
		})
		window.addEventListener('touchend', (e) => {
			if (this.mouseDownStart) {
				this.mouseDownStart = false
				this.onSelectionChanged()
			}
		})


		this.isBackspaceKeyPressed = false

		window.addEventListener('keydown', (e) => {

			
			
			
		})

		window.addEventListener('keydown', (e) => {

			if (e.which === 90 && (e.ctrlKey || e.metaKey)) {


				if (e.shiftKey) {
					e.preventDefault()
					this.undoManager.redo()
				} else {
					e.preventDefault()
					this.undoManager.undo()
				}

				this.onSelectionChanged()

			} else {
				this.onKeyDown(e)
			}

			if (e.which >= 37 && e.which <= 40) {
				this.onSelectionChanged()
			}

			if (e.which === 65 && e.ctrlKey) {
				this.selectedAll = true
			}

			this.domManager.hidePopTool()

		})

		window.addEventListener('keyup', (e) => {

			this.onKeyUp(e)

			if (this.selectedAll) {
				this.selectedAll = false
				this.onSelectionChanged()
			}

		})

		this.domManager.editor.addEventListener('keypress', (e) => {

			this.onKeyPress(e)

		})

		this.domManager.editor.addEventListener("input", (e) => {

			this.onInput(e)

		})


		this.domManager.editor.addEventListener('paste', (e) => { this.onPaste(e) })




		// PopTool
		// document.querySelector("#pt-p").addEventListener('click', (e) => { this.selManager.heading('P') })
		document.querySelector("#pt-h1").addEventListener('click', (e) => { this.selManager.heading('H1') })
		document.querySelector("#pt-h2").addEventListener('click', (e) => { this.selManager.heading('H2') })
		document.querySelector("#pt-h3").addEventListener('click', (e) => { this.selManager.heading('H3') })
		document.querySelector("#pt-bold").addEventListener('click', (e) => { this.selManager.changeTextStyle("bold") })
		document.querySelector("#pt-italic").addEventListener('click', (e) => { this.selManager.changeTextStyle("italic") })
		document.querySelector("#pt-underline").addEventListener('click', (e) => { this.selManager.changeTextStyle("underline") })
		document.querySelector("#pt-strike").addEventListener('click', (e) => { this.selManager.changeTextStyle("strikeThrough") })
		document.querySelector("#pt-alignleft").addEventListener('click', (e) => { this.selManager.align('left') })
		document.querySelector("#pt-alignmiddle").addEventListener('click', (e) => { this.selManager.align('center') })
		document.querySelector("#pt-alignright").addEventListener('click', (e) => { this.selManager.align('right') })

		document.querySelector("#pt-title-pack").addEventListener('click', (e) => {

			document.querySelector("#poptool .top-categories").classList.add("hidden")
			document.querySelector("#poptool .title-style").classList.remove("hidden")
			this.domManager.showPopTool()

		})

		document.querySelector("#pt-textstyle-pack").addEventListener('click', (e) => {

			document.querySelector("#poptool .top-categories").classList.add("hidden")
			document.querySelector("#poptool .text-style").classList.remove("hidden")
			this.domManager.showPopTool()

		})

		document.querySelector("#pt-align-pack").addEventListener('click', (e) => {

			document.querySelector("#poptool .top-categories").classList.add("hidden")
			document.querySelector("#poptool .align").classList.remove("hidden")
			this.domManager.showPopTool()

		})

		document.querySelector("#pt-link").addEventListener('click', (e) => {

			document.querySelector("#poptool .top-categories").classList.add("hidden")
			document.querySelector("#poptool .input").classList.remove("hidden")
			this.domManager.showPopTool()

			this.linkRange = this.selManager.getRange()

			setTimeout(() => {
				document.querySelector("#poptool .pack.input input").focus()
			}, 0)

		})

		document.querySelector("#pt-blockquote").addEventListener('click', (e) => {

			this.selManager.blockquote()

		})

		document.querySelectorAll("#poptool .pack button").forEach(function(elm) {
			elm.addEventListener('click', function() {
				self.domManager.showPopTool()
			})

		})

		document.querySelector("#poptool .pack.input input").addEventListener("keydown", function(e) {
			if (e.which === 13) {
				e.preventDefault()
				self.domManager.hidePopTool()
				self.selManager.replaceRange(self.linkRange)
				self.selManager.link(this.value)
				setTimeout(() => {
					this.value = ""
				}, 200)

			}
		})


		// Disable link by click
		this.domManager.editor.addEventListener('mousedown', function(e) {
			if (e.target.closest("a")) {
				self.selManager.unlink(e.target.closest("a"))
				self.domManager.hidePopTool()
			}
		})
		this.domManager.editor.addEventListener('touchstart', function(e) {
			console.log(e.target)
			console.log(e.target.closest("a"))
			if (e.target.closest("a")) {
				self.selManager.unlink(e.target.closest("a"))
				self.domManager.hidePopTool()
			}
		})

		// Image click event
		window.addEventListener('click', (e) => {

			if (e.target.classList.contains("image-wrapper")) {

				console.log("image clicked")
				e.preventDefault()

				var selectedFigure = this.domManager.editor.querySelector("figure.image-selected")
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected")
				}

				var figure = e.target.parentNode
				figure.classList.remove("caption-selected")
				figure.classList.add("image-selected")
				this.domManager.showImageTool(e.target)

				if (this.selManager.isTextEmptyNode(figure.querySelector("FIGCAPTION"))) {
					figure.querySelector("FIGCAPTION").innerHTML = "이미지 주석"
				}

				window.getSelection().removeAllRanges()

			} else if (e.target.id === "full" && e.target.nodeName === "BUTTON") {

				var selectedFigure = this.domManager.editor.querySelector("figure.image-selected")
				selectedFigure.classList.add("full")
				this.domManager.hideImageTool()
				setTimeout(() => {
					this.domManager.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)

			} else if (e.target.id === "normal" && e.target.nodeName === "BUTTON") {

				var selectedFigure = this.domManager.editor.querySelector("figure.image-selected")
				selectedFigure.classList.remove("full")
				this.domManager.hideImageTool()
				setTimeout(() => {
					this.domManager.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)

			} else if (e.target.nodeName === "FIGCAPTION") {

				e.target.parentNode.classList.add("caption-selected")
				e.target.parentNode.classList.remove("image-selected")
				this.domManager.hideImageTool()
				if (!e.target.parentNode.classList.contains("caption-enabled")) {
					e.target.innerHTML = "<br>"
				}

			} else if (e.target.nodeName === "INPUT" && e.target.parentNode.classList.contains('pack')) {

				// console.log("clicked poptool input")

			} else {

				var selectedFigure = this.domManager.editor.querySelector("figure.image-selected, figure.caption-selected")
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected")
					selectedFigure.classList.remove("caption-selected")
				}

				this.domManager.hideImageTool()

			}
		})


		window.addEventListener('mousedown', (e) => {
			if (e.target.classList.contains("image-wrapper")) {
				window.getSelection().removeAllRanges()
				e.preventDefault()
			}
		})

		// disable images contenteditable false
		// var imgs = document.getElementsByTagName("figure")
		// for (var i = 0 i < imgs.length ++i) {
		// 			imgs[i].contentEditable = false
		// }
	}

	// Events



	/**
	*
	* @param {KeyboardEvent} e
	*/
	onPaste (e) {

		let originalRange = this.selManager.getRange()
		if (!originalRange) {
			return
		}

		let pasteArea = document.querySelector("#paste-area")
		// let pasteArea = document.createElement("div")

		pasteArea.innerHTML = ""


		let range = document.createRange()
		range.setStart(pasteArea, 0)
		range.collapse(true)

		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)

		setTimeout(() => {

			window.getSelection().removeAllRanges()
			window.getSelection().addRange(originalRange)
			this.selManager.removeSelection("start")

			var node, travelNode, nextNode
			node = pasteArea.firstChild
			travelNode = pasteArea.firstChild

			var metTop = false

			// Loop all node and analyze
			while (1) {
				// if (!node) {
				// 	return
				// }
				// for (var i = node.attributes.length - 1 i >= 0 i--){
				// 	node.removeAttribute(node.attributes[i].name)
				// }
				// node = node.nextSibling

				console.log(travelNode)

				if (!travelNode) {
					break
				} else {

					if (travelNode.attributes) {
						for (var i = travelNode.attributes.length - 1; i >= 0; i--){
							if (
								travelNode.nodeName === "IMG" && travelNode.attributes[i].name === "src"
							) {
								continue
							}
							travelNode.removeAttribute(travelNode.attributes[i].name)
						}
					}


					if (travelNode.firstChild) {
						travelNode = travelNode.firstChild
					} else if (travelNode.nextSibling) {
						travelNode = travelNode.nextSibling
					} else {
						while (true) {
							travelNode = travelNode.parentNode
							if (travelNode === pasteArea) {
								metTop = true
							}
							if (travelNode.nextSibling) {
								travelNode = travelNode.nextSibling
								break
							}
						}
					}
				}

				if (metTop) {
					break
				}

			}

			// pasteArea.innerHTML = ""

		}, 1)


	}


	onKeyPress (e)
	{
	}

	/**
	*
	* @param {KeyboardEvent} e
	*/
	onKeyDown (e) {

		this.keyDownLocked = true

		let keyCode = e.which
		let physKeyCode = e.code

		let currentNode = this.selManager.getNodeInSelection()

		console.log(currentNode)

		let enableTextChangeRecord = false

		let key = "char"
		let validCharKey
		validCharKey = 
			((keyCode > 47 && keyCode < 58)  || // number keys
			keyCode === 32                   || // spacebar & return key(s) (if you want to allow carriage returns)
			(keyCode > 64 && keyCode < 91)   || // letter keys
			(keyCode > 95 && keyCode < 112)  || // numpad keys
			(keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
			(keyCode > 218 && keyCode < 223) || // [\]' (in order)
			keyCode === 229)
			&& !e.ctrlKey

		// validCharKey =
		// 	(physKeyCode === "KeyA" || physKeyCode === "KeyB" || physKeyCode === "KeyC" || physKeyCode === "KeyD" ||
		// 	physKeyCode === "KeyE" || physKeyCode === "KeyF" || physKeyCode === "KeyG" || physKeyCode === "KeyH" ||
		// 	physKeyCode === "KeyI" || physKeyCode === "KeyJ" || physKeyCode === "KeyK" || physKeyCode === "KeyL" ||
		// 	physKeyCode === "KeyM" || physKeyCode === "KeyN" || physKeyCode === "KeyO" || physKeyCode === "KeyP" ||
		// 	physKeyCode === "KeyQ" || physKeyCode === "KeyR" || physKeyCode === "KeyS" || physKeyCode === "KeyT" ||
		// 	physKeyCode === "KeyU" || physKeyCode === "KeyV" || physKeyCode === "KeyW" || physKeyCode === "KeyX" ||
		// 	physKeyCode === "KeyY" || physKeyCode === "KeyZ" ||
		// 	physKeyCode === "Digit0" || physKeyCode === "Digit1" || physKeyCode === "Digit2" || physKeyCode === "Digit3" ||
		// 	physKeyCode === "Digit4" || physKeyCode === "Digit5" || physKeyCode === "Digit6" || physKeyCode === "Digit7" ||
		// 	physKeyCode === "Digit8" || physKeyCode === "Digit9" ||
		// 	physKeyCode === "Numpad0" || physKeyCode === "Numpad1" || physKeyCode === "Numpad2" || physKeyCode === "Numpad3" ||
		// 	physKeyCode === "Numpad4" || physKeyCode === "Numpad5" || physKeyCode === "Numpad6" || physKeyCode === "Numpad7" ||
		// 	physKeyCode === "Numpad8" || physKeyCode === "Numpad9" ||
		// 	physKeyCode === "NumpadDecimal" || physKeyCode === "NumpadDivide" || physKeyCode === "NumpadMultiply" ||
		// 	physKeyCode === "NumpadSubtract" || physKeyCode === "NumpadAdd" ||
		// 	physKeyCode === "Backquote" || physKeyCode === "Minus" || physKeyCode === "Equal" || physKeyCode === "Backslash" ||
		// 	physKeyCode === "BracketLeft" || physKeyCode === "BracketRight" || physKeyCode === "Semicolon" || physKeyCode === "Quote" ||
		// 	physKeyCode === "Comma" || physKeyCode === "Period" || physKeyCode === "Slash" ||
		// 	physKeyCode === "Space")
		// 	&& !e.ctrlKey

		var sel = window.getSelection()
		if (sel.rangeCount > 0) {
			if (!this.domManager.editor.contains(sel.getRangeAt(0).startContainer)) {
				// console.warn("The given range is not in the editor. Editor's features will work only inside the editor.")
				return
			}
		}



		if (keyCode === 8) {

			if (this.selManager.getSelectionPositionInParagraph() !== 1 && !this.selManager.isTextEmptyNode(currentNode) && this.selManager.getRange() && this.selManager.getRange().collapsed) {
				enableTextChangeRecord = true
				key = "backspace"
			}

			// Backspace
			this.selManager.backspace(e)

		} else if (keyCode === 46) {

			if (this.selManager.getSelectionPositionInParagraph() !== 3 && !this.selManager.isTextEmptyNode(currentNode) && this.selManager.getRange() && this.selManager.getRange().collapsed) {
				enableTextChangeRecord = true
				key = "delete"
			}

			// Delete
			this.selManager.delete(e)

		} else if (keyCode === 13) {


			// Enter(Return)
			this.selManager.enter(e)

		} else if (keyCode === 90 && e.ctrlKey) {

			// e.preventDefault()
			// this.ssManager.undo()

		}

		if (validCharKey || enableTextChangeRecord) {

			// press character keys
			console.log("character", e.which, e.code)

			if (window.getSelection().rangeCount > 0 && !window.getSelection().getRangeAt(0).collapsed) {
				this.selManager.removeSelection("backspace", true)
				this.selManager.backspace(document.createEvent("KeyboardEvent"), true)
			}

			this.charKeyDownLocked = true

			let lastAction = this.undoManager.getTheLatestAction()

			if (lastAction && lastAction.type === "textChange" && lastAction.targetNode === currentNode && keyCode !== 32 && lastAction.key === key && !lastAction.locked) {

			} else if (currentNode) {

				this.undoManager.recordAction({
					type: "textChange",
					targetNode: currentNode,
					prevContent: currentNode.innerHTML,
					prevTextOffset: this.selManager.getTextOffset(),
					key: key,
					locked: false
				})

			}

		} else {

		}

	}

	/**
	 * 
	 * @param {InputEvent} e 
	 */
	onInput (e)
	{

		// input event only detects printable input

		if (this.keyDownLocked) {

			// Key down is detected

			this.keyDownLocked = false

		} else {

			// Key down is not detected but input is detected
			// it means the pressed key is Hangul
			// Keydown is not detected, so implementing keydown event once again from here

			let currentNode = this.selManager.getNodeInSelection()

			this.charKeyDownLocked = false
			let lastAction = this.undoManager.getTheLatestAction()

			if (lastAction && lastAction.type === "textChange" && lastAction.targetNode === currentNode && lastAction.key === "char" && !lastAction.locked) {

				lastAction.nextContent = currentNode.innerHTML
				lastAction.nextTextOffset = this.selManager.getTextOffset()

			} else if (currentNode && e.isComposing) {

				this.undoManager.recordAction({
					type: "textChange",
					targetNode: currentNode,
					prevContent: this.selManager.currentNodeOrgHTML,
					prevTextOffset: this.selManager.getTextOffset(),
					key: "char",
					locked: false
				})

			}

			// if (lastAction && lastAction.type === "textChange" && lastAction.targetNode === currentNode) {

			// 	lastAction.nextContent = currentNode.innerHTML
			// 	lastAction.nextTextOffset = this.selManager.getTextOffset()

			// }
		}

		

	}

	/**
	* Fires when press keyboard inside the editor.
	* @param {KeyboardEvent} e
	*/
	onKeyUp (e)
	{

		this.keyDownLocked = false

		var currentNode = this.selManager.getNodeInSelection()
		if (currentNode && currentNode.textContent !== "" && currentNode.querySelector("br")) {

			console.log('removed br')
			currentNode.removeChild(currentNode.querySelector("br"))

		} else if (currentNode && currentNode.textContent === "" && !currentNode.querySelector("br")) {

			currentNode.appendChild(document.createElement("br"))

		}

		// Image block controlling
		if (this.selManager.isImageCaption(currentNode)) {

			if (this.selManager.isTextEmptyNode(currentNode)) {

				currentNode.parentNode.classList.remove("caption-enabled")

			} else {

				currentNode.parentNode.classList.add("caption-enabled")

			}

		}

		if (currentNode && currentNode.textContent.match(/^- /) && this.selManager.isParagraph(currentNode)) {

			// console.log(currentNode.textContent.match(/^- /))

			this.selManager.list("ul")

			let currentNode = this.selManager.getNodeInSelection()
			currentNode.innerHTML = currentNode.innerHTML.replace(/^- /, "")

			if (this.selManager.isTextEmptyNode(currentNode)) {
				currentNode.innerHTML = "<br>"
			}

			this.selManager.setCursorAt(currentNode, 0)

		} else if (currentNode && currentNode.textContent.match(/^1\. /) && this.selManager.isParagraph(currentNode)) {

			// console.log(currentNode.textContent.match(/^- /))

			this.selManager.list("ol")

			let currentNode = this.selManager.getNodeInSelection()
			currentNode.innerHTML = currentNode.innerHTML.replace(/^1\. /, "")

			if (this.selManager.isTextEmptyNode(currentNode)) {
				currentNode.innerHTML = "<br>"
			}

			this.selManager.setCursorAt(currentNode, 0)

		}

		if (this.charKeyDownLocked) {

			this.charKeyDownLocked = false
			let lastAction = this.undoManager.getTheLatestAction()

			if (lastAction && lastAction.type === "textChange" && lastAction.targetNode === currentNode) {

				lastAction.nextContent = currentNode.innerHTML
				lastAction.nextTextOffset = this.selManager.getTextOffset()

			}
		}

	}

	onSelectionChanged () {

		// console.log("selection changed")

		let lastAction = this.undoManager.getTheLatestAction()
		if (lastAction && lastAction.type === "textChange") {
			lastAction.locked = true
		}

		this.selManager.fixSelection()

		// update selection manager's currentnode original html
		if (this.selManager.getNodeInSelection()) {

			this.selManager.currentNodeOrgHTML = this.selManager.getNodeInSelection().innerHTML

		} else {

			this.selManager.currentNodeOrgHTML = ""
			
		}
		

		setTimeout(() => {
			this.domManager.togglePopTool()
		}, 0)

	}

}
