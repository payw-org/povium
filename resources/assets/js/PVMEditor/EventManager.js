import PVMEditSession from "./PVMEditSession"
import PopTool from "./PopTool"
import PVMEditor from "./PVMEditor"

export default class EventManager {

	/**
	 *
	 * @param {PVMEditSession} editSession
	 */
	constructor(editSession) {

		this.session = editSession
		this.sel = editSession.selection
		this.undoMan = editSession.undoManager
		this.nodeMan = editSession.pvmNodeManager

	}

	attachEvents()
	{
		// Properties
		let self = this

		this.mouseDownStart = false
		this.linkRange = document.createRange()
		this.charKeyDownLocked = false
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
				this.pt.hidePopTool()
				this.mouseDownStart = true
			}

		})
		window.addEventListener('touchstart', (e) => {
			if (!e.target.closest("#poptool")) {
				this.pt.hidePopTool()
				this.mouseDownStart = true
			}

		})

		this.session.editorBody.addEventListener('mouseup', (e) => {
			this.onSelectionChanged()
		})
		this.session.editorBody.addEventListener('touchend', (e) => {
			this.onSelectionChanged()
		})
		this.session.editorBody.addEventListener('dragstart', (e) => {
			e.preventDefault()
		})
		this.session.editorBody.addEventListener('drop', (e) => {
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

		this.session.editorBody.addEventListener('keydown', (e) => {

			if (e.which === 90 && (e.ctrlKey || e.metaKey)) {


				if (e.shiftKey) {
					e.preventDefault()
					this.undoMan.redo()
				} else {
					e.preventDefault()
					this.undoMan.undo()
				}

				// this.onSelectionChanged()

			} else {
				this.onKeyDown(e)
			}

			if (e.which >= 37 && e.which <= 40) {
				// this.onSelectionChanged()
			}

			if (e.which === 65 && e.ctrlKey) {
				this.selectedAll = true
			}

			if (!e.target.closest("#poptool")) {
				this.pt.hidePopTool()
			}

		})

		this.session.editorBody.addEventListener('keyup', (e) => {

			this.onKeyUp(e)
			this.onSelectionChanged()

			if (this.selectedAll) {
				this.selectedAll = false
				this.onSelectionChanged()
			}

		})

		this.session.editorBody.addEventListener('keypress', (e) => {

			this.onKeyPress(e)

		})


		this.session.editorBody.addEventListener('paste', (e) => { this.onPaste(e) })




		// PopTool

		this.session.editorBody.addEventListener('mousedown', (e) => {
			if (!this.pt.dom.contains(e.target)) {
				this.pt.hidePopTool()
			}
		})

		this.session.editorBody.addEventListener('mouseup', (e) => {
			setTimeout(() => {
				this.pt.togglePopTool()
			}, 0);

		})

		this.session.editorBody.addEventListener('keydown', (e) => {
			let keyCode = e.which
			if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
				this.pt.togglePopTool()
			}
		})

		this.pt.dom.querySelectorAll("button").forEach((elm) => {
			elm.addEventListener("click", () => {
				let currentRange = this.sel.getCurrentRange()
				if (!currentRange.start.nodeID && !currentRange.end.nodeID) {
					this.pt.hidePopTool()
				}
			})
		})



		// Disable link by click
		this.session.editorBody.addEventListener('mousedown', function (e) {
			if (e.target.closest("a")) {
				self.postEditor.selManager.unlink(e.target.closest("a"))
				self.postEditor.domManager.hidePopTool()
			}
		})
		this.session.editorBody.addEventListener('touchstart', function (e) {
			console.log(e.target)
			console.log(e.target.closest("a"))
			if (e.target.closest("a")) {
				self.postEditor.selManager.unlink(e.target.closest("a"))
				self.postEditor.domManager.hidePopTool()
			}
		})

		// Image click event
		window.addEventListener('click', (e) => {

			if (e.target.classList.contains("image-wrapper")) {

				console.log("image clicked")
				e.preventDefault()

				var selectedFigure = this.session.editorBody.querySelector("figure.image-selected")
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected")
				}

				var figure = e.target.parentElement
				figure.classList.remove("caption-selected")
				figure.classList.add("image-selected")
				this.pt.showImageTool(e.target)

				if (figure.querySelector("FIGCAPTION").textContent.length === 0) {
					figure.querySelector("FIGCAPTION").innerHTML = "이미지 주석"
				}

				window.getSelection().removeAllRanges()

			} else if (e.target.id === "full" && e.target.nodeName === "BUTTON") {

				var selectedFigure = this.session.editorBody.querySelector("figure.image-selected")
				selectedFigure.classList.add("full")
				this.pt.hideImageTool()
				setTimeout(() => {
					this.pt.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)

			} else if (e.target.id === "normal" && e.target.nodeName === "BUTTON") {

				var selectedFigure = this.session.editorBody.querySelector("figure.image-selected")
				selectedFigure.classList.remove("full")
				this.pt.hideImageTool()
				setTimeout(() => {
					this.pt.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)

			} else if (e.target.nodeName === "FIGCAPTION") {

				e.target.parentNode.classList.add("caption-selected")
				e.target.parentNode.classList.remove("image-selected")
				this.pt.hideImageTool()
				if (!e.target.parentNode.classList.contains("caption-enabled")) {
					e.target.innerHTML = "<br>"
				}

			} else if (e.target.nodeName === "INPUT" && e.target.parentNode.classList.contains('pack')) {

				// console.log("clicked poptool input")

			} else {

				var selectedFigure = this.session.editorBody.querySelector("figure.image-selected, figure.caption-selected")
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected")
					selectedFigure.classList.remove("caption-selected")
				}

				this.pt.hideImageTool()

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

	// Setters

	/**
	 * 
	 * @param {PopTool} pt 
	 */
	setPopTool(pt)
	{
		this.pt = pt
	}

	/**
	 * 
	 * @param {PVMEditor} pvmEditor 
	 */
	setEditor(pvmEditor)
	{
		this.editor = pvmEditor
	}

	// Events



	/**
	*
	* @param {KeyboardEvent} e
	*/
	onPaste(e) {

		let originalRange = this.postEditor.selManager.getRange()
		if (!originalRange) {
			return
		}

		let pasteArea = this.session.editorDOM.querySelector("#paste-area")
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
			this.postEditor.selManager.removeSelection("start")

			let originalCurrentNode = this.postEditor.selManager.getNodeInSelection()
			let lastPastedNode = originalCurrentNode

			var node, travelNode, nextNode
			node = pasteArea.firstChild
			travelNode = pasteArea.firstChild

			var metTop = false
			let firstNode = true

			// Loop all node and analyze
			while (1) {
				// if (!node) {
				// 	return
				// }
				// for (var i = node.attributes.length - 1 i >= 0 i--){
				// 	node.removeAttribute(node.attributes[i].name)
				// }
				// node = node.nextSibling

				if (!travelNode) {
					break
				} else {

					// console.log(travelNode)

					let clonedTravelNode = travelNode.cloneNode(true)

					// console.log(lastPastedNode)

					// If the node is available node, paste it into the editor
					if (
						this.postEditor.selManager.isParagraph(travelNode) ||
						this.postEditor.selManager.isHeading(travelNode) ||
						this.postEditor.selManager.isBlockquote(travelNode) ||
						this.postEditor.selManager.isList(travelNode)
					) {

						if (firstNode) {

							firstNode = false
							let tn = document.createTextNode(clonedTravelNode.textContent)
							originalRange.insertNode(tn)

							let range = document.createRange()
							range.setStartAfter(tn)
							window.getSelection().removeAllRanges()
							window.getSelection().addRange(range)

						} else {

							this.session.editorBody.insertBefore(clonedTravelNode, lastPastedNode.nextSibling)
							lastPastedNode = clonedTravelNode

							let range = document.createRange()
							range.setStartAfter(clonedTravelNode)
							window.getSelection().removeAllRanges()
							window.getSelection().addRange(range)

						}

						// No need to loop through the node
						travelNode = travelNode.nextSibling
						continue

					} else if (travelNode.nodeType === 3) { // Reached the textNode in the deepest node

						if (firstNode) {

							firstNode = false
							let tn = document.createTextNode(clonedTravelNode.textContent)
							originalRange.insertNode(tn)

							let range = document.createRange()
							range.setStartAfter(tn)
							window.getSelection().removeAllRanges()
							window.getSelection().addRange(range)

						} else {

							let p = this.session.generateEmptyNode("p")
							p.innerHTML = travelNode.textContent
							this.session.editorBody.insertBefore(p, lastPastedNode.nextSibling)

							let range = document.createRange()
							range.setStartAfter(p)
							window.getSelection().removeAllRanges()
							window.getSelection().addRange(range)

						}

					}



					if (travelNode.attributes) {
						for (var i = travelNode.attributes.length - 1; i >= 0; i--) {
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


	onKeyPress(e) {
		// console.log("keypress")
	}

	/**
	*
	* @param {KeyboardEvent} e
	*/
	onKeyDown(e)
	{

		let keyCode = e.which
		let physKeyCode = e.code
		// console.log(keyCode, physKeyCode)

		let currentRange = this.sel.getCurrentRange()
		let currentNode = this.sel.getCurrentTextNode()
		if (!currentNode) return

		let enableTextChangeRecord = false

		let key = "char"
		let validCharKey
		validCharKey =
			((keyCode > 47 && keyCode < 58) || // number keys
				keyCode === 32 || // spacebar & return key(s) (if you want to allow carriage returns)
				(keyCode > 64 && keyCode < 91) || // letter keys
				(keyCode > 95 && keyCode < 112) || // numpad keys
				(keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
				(keyCode > 218 && keyCode < 223) || // [\]' (in order)
				keyCode === 229)
			&& !e.ctrlKey && !e.metaKey

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
			if (!this.session.editorBody.contains(sel.getRangeAt(0).startContainer)) {
				// console.warn("The given range is not in the editor. Editor's features will work only inside the editor.")
				return
			}
		}

		if (keyCode === 8) {

			if (
				currentRange &&
				currentRange.isCollapsed() &&
				(currentRange.start.state !== 1 && currentRange.start.state !== 4)
			) {
				enableTextChangeRecord = true
				key = "backspace"
			} else {
				enableTextChangeRecord = false
				this.editor.onPressBackspace(e)
			}

			// Backspace
			// this.postEditor.selManager.backspace(e)

		} else if (keyCode === 46) {

			if (
				currentRange &&
				currentRange.isCollapsed() &&
				(currentRange.start.state !== 3 && currentRange.start.state !== 4)
			) {
				enableTextChangeRecord = true
				key = "delete"
			} else {
				enableTextChangeRecord = false
				this.editor.onPressDelete(e)
			}

		} else if (keyCode === 13) {

			// Enter(Return)
			e.preventDefault()
			this.editor.onPressEnter(e)

		} else if (keyCode === 90 && e.ctrlKey) {

			// e.preventDefault()
			// this.ssManager.undo()

		}

		if (validCharKey || enableTextChangeRecord) {

			if (window.getSelection().rangeCount > 0 && !window.getSelection().getRangeAt(0).collapsed) {
				this.postEditor.selManager.removeSelection("backspace", true)
				this.postEditor.selManager.backspace(document.createEvent("KeyboardEvent"), true)
			}

			this.charKeyDownLocked = true

			let lastAction = this.undoMan.getLastestAction()
			
			if (
				lastAction &&
				lastAction.type === "textChange" &&
				lastAction.affectedNode.isEqualTo(currentNode) &&
				(keyCode !== 32 && physKeyCode !== "Space") &&
				lastAction.key === key &&
				!lastAction.locked
			) {

			} else if (currentNode) {

				this.undoMan.record({
					type: "textChange",
					affectedNode: currentNode,
					affectedNodeID: currentNode.nodeID,
					key: key,
					locked: false,
					before: {
						innerHTML: this.sel.currentState.innerHTML,
						range: this.sel.currentState.range
					}
				})

			}

		} else {

		}

	}

	onPressEnter(e)
	{

	}

	/**
	 * 
	 * @param {InputEvent} e 
	 */
	onInput(e) {

	}

	/**
	* Fires when press keyboard inside the editor.
	* @param {KeyboardEvent} e
	*/
	onKeyUp(e) {

		// console.log("keyup")

		this.keyCode = e.which
		this.physKeyCode = e.code

		let currentRange = this.sel.getCurrentRange()

		if (!currentRange) return
		let currentNode = this.sel.getCurrentTextNode()
		if (!currentNode) {
			return
		}
		let br = currentNode.textDOM.querySelector("br")
		if (currentNode && currentNode.textContent !== "" && br) {

			console.log('removed br')
			currentNode.textDOM.removeChild(br)

		} else if (currentNode && currentNode.textContent === "" && !br) {

			currentNode.textDOM.appendChild(document.createElement("br"))

		}

		// Image block controlling
		if (currentNode.type === "FIGURE") {

			if (currentNode.textContent === "") {

				currentNode.dom.classList.remove("caption-enabled")

			} else {

				currentNode.dom.classList.add("caption-enabled")

			}

		}

		if (currentNode && currentNode.textContent.match(/^- /) && this.postEditor.selManager.isParagraph(currentNode)) {

			let currentNode = this.postEditor.selManager.getNodeInSelection()

			// console.log(currentNode.textContent.match(/^- /))

			currentNode.innerHTML = currentNode.innerHTML.replace(/^- /, "")

			this.postEditor.selManager.list("ul")




			if (this.postEditor.selManager.isTextEmptyNode(currentNode)) {
				currentNode.innerHTML = "<br>"
			}

			this.postEditor.selManager.setCursorAt(currentNode, 0)

		} else if (currentNode && currentNode.textContent.match(/^1\. /) && this.postEditor.selManager.isParagraph(currentNode)) {

			let currentNode = this.postEditor.selManager.getNodeInSelection()

			// console.log(currentNode.textContent.match(/^- /))

			currentNode.innerHTML = currentNode.innerHTML.replace(/^1\. /, "")

			this.postEditor.selManager.list("ol")




			if (this.postEditor.selManager.isTextEmptyNode(currentNode)) {
				currentNode.innerHTML = "<br>"
			}

			this.postEditor.selManager.setCursorAt(currentNode, 0)

		}

		this.charKeyDownLocked = false
		let lastAction = this.undoMan.getLastestAction()

		if (
			lastAction &&
			lastAction.type === "textChange" &&
			lastAction.affectedNode.isEqualTo(currentNode)
		) {

			lastAction.setAfter({
				innerHTML: currentNode.textDOM.innerHTML,
				range: currentRange
			})

			}

	}

	onSelectionChanged() {

		// console.log('selection has been changed')

		let currentRange = this.sel.getCurrentRange()
		let currentNode = this.sel.getCurrentTextNode()
		if (currentNode) {
			this.sel.currentState.nodeID = currentNode.nodeID
			this.sel.currentState.innerHTML = currentNode.textDOM.innerHTML
			this.sel.currentState.range = currentRange
		}

		this.pt.togglePopTool()

		// console.log(this.sel.currentState.innerHTML)


		// let lastAction = this.postEditor.undoManager.getTheLatestAction()
		// if (lastAction && lastAction.type === "textChange") {
		// 	lastAction.locked = true
		// }

		// this.postEditor.selManager.fixSelection()

		// // update selection manager's currentnode original html
		// if (this.postEditor.selManager.getNodeInSelection()) {

		// 	this.postEditor.selManager.currentNodeOrgHTML = this.postEditor.selManager.getNodeInSelection().innerHTML

		// } else {

		// 	this.postEditor.selManager.currentNodeOrgHTML = ""

		// }


		// setTimeout(() => {
		// 	this.session.togglePopTool()
		// }, 0)



		// // Detect lists and merge them
		// let currentNode = this.postEditor.selManager.getNodeInSelection()
		// if (this.postEditor.selManager.isListItem(currentNode)) {
		// 	console.log("list")
		// }

	}

}
