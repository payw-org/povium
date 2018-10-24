import NodeManager from "./NodeManager"
import UndoManager from "./UndoManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"
import PopTool from "./PopTool"
import AT from "./config/AvailableTypes"

export default class EventManager {

	constructor() {

		/**
		 * @type {NodeManager}
		 */
		this.nodeMan = null
		/**
		 * @type {UndoManager}
		 */
		this.undoMan = null
		/**
		 * @type {SelectionManager}
		 */
		this.selMan = null
		/**
		 * @type {EditSession}
		 */
		this.editSession = null
		/**
		 * @type {PopTool}
		 */
		this.popTool = null

	}

	attachEvents() {
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
				this.popTool.hidePopTool()
				this.mouseDownStart = true
			}

		})
		window.addEventListener('touchstart', (e) => {
			if (!e.target.closest("#poptool")) {
				this.popTool.hidePopTool()
				this.mouseDownStart = true
			}

		})

		this.editSession.editorBody.addEventListener('mouseup', (e) => {
			this.onSelectionChanged()
		})
		this.editSession.editorBody.addEventListener('touchend', (e) => {
			this.onSelectionChanged()
		})
		this.editSession.editorBody.addEventListener('dragstart', (e) => {
			e.preventDefault()
		})
		this.editSession.editorBody.addEventListener('drop', (e) => {
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

		this.editSession.editorBody.addEventListener('keydown', (e) => {

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
				this.popTool.hidePopTool()
			}

		})

		this.editSession.editorBody.addEventListener('keyup', (e) => {

			this.onKeyUp(e)
			this.onSelectionChanged()

			if (this.selectedAll) {
				this.selectedAll = false
				this.onSelectionChanged()
			}

		})

		this.editSession.editorBody.addEventListener('keypress', (e) => {

			this.onKeyPress(e)

		})


		this.editSession.editorBody.addEventListener('paste', (e) => { this.onPaste(e) })



		// Disable link by click
		this.editSession.editorBody.addEventListener('mousedown', function (e) {
			if (e.target.closest("a")) {
				self.postEditor.selManager.unlink(e.target.closest("a"))
				self.postEditor.domManager.hidePopTool()
			}
		})
		this.editSession.editorBody.addEventListener('touchstart', function (e) {
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

				var selectedFigure = this.editSession.editorBody.querySelector("figure.image-selected")
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected")
				}

				var figure = e.target.parentElement
				figure.classList.remove("caption-selected")
				figure.classList.add("image-selected")
				this.popTool.showImageTool(e.target)

				if (figure.querySelector("FIGCAPTION").textContent.length === 0) {
					figure.querySelector("FIGCAPTION").innerHTML = "이미지 주석"
				}

				window.getSelection().removeAllRanges()

			} else if (e.target.id === "full" && e.target.nodeName === "BUTTON") {

				var selectedFigure = this.editSession.editorBody.querySelector("figure.image-selected")
				selectedFigure.classList.add("full")
				this.popTool.hideImageTool()
				setTimeout(() => {
					this.popTool.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)

			} else if (e.target.id === "normal" && e.target.nodeName === "BUTTON") {

				var selectedFigure = this.editSession.editorBody.querySelector("figure.image-selected")
				selectedFigure.classList.remove("full")
				this.popTool.hideImageTool()
				setTimeout(() => {
					this.popTool.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)

			} else if (e.target.nodeName === "FIGCAPTION") {

				e.target.parentNode.classList.add("caption-selected")
				e.target.parentNode.classList.remove("image-selected")
				this.popTool.hideImageTool()
				if (!e.target.parentNode.classList.contains("caption-enabled")) {
					e.target.innerHTML = "<br>"
				}

			} else if (e.target.nodeName === "INPUT" && e.target.parentNode.classList.contains('pack')) {

				// console.log("clicked poptool input")

			} else {

				var selectedFigure = this.editSession.editorBody.querySelector("figure.image-selected, figure.caption-selected")
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected")
					selectedFigure.classList.remove("caption-selected")
				}

				this.popTool.hideImageTool()

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

		this.attachPopToolEvents()
	}

	attachPopToolEvents() {

		let self = this

		window.addEventListener("mousedown", (e) => {
			if (!e.target.classList.contains("operation") && !e.target.closest("button .operation")) {
				this.popTool.hidePopTool()
			}
		})

		this.editSession.editorBody.addEventListener("mouseup", (e) => {
			setTimeout(() => {
				this.popTool.togglePopTool()
			}, 0);

		})

		this.editSession.editorBody.addEventListener("keyup", (e) => {
			let keyCode = e.which
			if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
				this.popTool.togglePopTool()
			}
		})

		this.popTool.pt.querySelectorAll("button").forEach((elm) => {
			elm.addEventListener("click", () => {
				let currentRange = this.selMan.getCurrentRange()
				if (!currentRange.start.node && !currentRange.end.node) {
					this.popTool.hidePopTool()
				}
			})
		})

		// this.popTool.pt.querySelector("#pt-p").addEventListener('click', (e) => { this.postEditor.selManager.heading('P') })
		this.popTool.pt.querySelector("#pt-h1").addEventListener('click', (e) => { this.popTool.transformNodes("h1") })
		this.popTool.pt.querySelector("#pt-h2").addEventListener('click', (e) => { this.popTool.transformNodes("h2") })
		this.popTool.pt.querySelector("#pt-h3").addEventListener('click', (e) => { this.popTool.transformNodes("h3") })
		this.popTool.pt.querySelector("#pt-bold").addEventListener('click', (e) => { this.popTool.changeTextStyle("bold") })
		this.popTool.pt.querySelector("#pt-italic").addEventListener('click', (e) => { this.popTool.changeTextStyle("italic") })
		this.popTool.pt.querySelector("#pt-underline").addEventListener('click', (e) => { this.popTool.changeTextStyle("underline") })
		this.popTool.pt.querySelector("#pt-strike").addEventListener('click', (e) => { this.popTool.changeTextStyle("strikethrough") })
		this.popTool.pt.querySelector("#pt-alignleft").addEventListener('click', (e) => { this.popTool.align("left") })
		this.popTool.pt.querySelector("#pt-alignmiddle").addEventListener('click', (e) => { this.popTool.align("center") })
		this.popTool.pt.querySelector("#pt-alignright").addEventListener('click', (e) => { this.popTool.align("right") })

		this.popTool.pt.querySelector("#pt-title-pack").addEventListener('click', (e) => {

			console.log("here")

			this.popTool.pt.querySelector(".top-categories").classList.add("hidden")
			this.popTool.pt.querySelector(".title-style").classList.remove("hidden")
			this.popTool.showPopTool()

		})

		this.popTool.pt.querySelector("#pt-textstyle-pack").addEventListener('click', (e) => {

			this.popTool.pt.querySelector(".top-categories").classList.add("hidden")
			this.popTool.pt.querySelector(".text-style").classList.remove("hidden")
			this.popTool.showPopTool()

		})

		this.popTool.pt.querySelector("#pt-align-pack").addEventListener('click', (e) => {

			this.popTool.pt.querySelector(".top-categories").classList.add("hidden")
			this.popTool.pt.querySelector(".align").classList.remove("hidden")
			this.popTool.showPopTool()

		})

		this.popTool.pt.querySelector("#pt-link").addEventListener('click', (e) => {

			this.popTool.pt.querySelector(".top-categories").classList.add("hidden")
			this.popTool.pt.querySelector(".input").classList.remove("hidden")
			this.popTool.showPopTool()

			this.tempLinkRange = this.selMan.getCurrentRange()

			setTimeout(() => {
				document.querySelector(".pack.input input").focus()
			}, 0)

		})

		this.popTool.pt.querySelector(".pack.input input").addEventListener("keydown", function(e) {
			if (e.which === 13) {
				e.preventDefault()
				self.popTool.hidePopTool()
				self.sel.setRange(self.tempLinkRange)
				// self.postEditor.selManager.link(this.value)
				setTimeout(() => {
					this.value = ""
				}, 200)

			}
		})

		this.popTool.pt.querySelector("#pt-blockquote").addEventListener('click', (e) => {

			this.popTool.transformNodes("blockquote")

		})

		this.popTool.pt.querySelectorAll(".pack button").forEach((elm) => {
			elm.addEventListener('click', () => {
				this.popTool.showPopTool()
			})
		})

	}

	// Setters

	/**
	 *
	 * @param {PopTool} pt
	 */
	setPopTool(pt)
	{
		this.popTool.pt = pt
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

		let pasteArea = this.editSession.editorDOM.querySelector("#paste-area")
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

							this.editSession.editorBody.insertBefore(clonedTravelNode, lastPastedNode.nextSibling)
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

							let p = this.editSession.generateEmptyNode("p")
							p.innerHTML = travelNode.textContent
							this.editSession.editorBody.insertBefore(p, lastPastedNode.nextSibling)

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
	onKeyDown(e) {

		let keyCode = e.which
		let physKeyCode = e.code
		// console.log(keyCode, physKeyCode)

		let currentRange = this.selMan.getCurrentRange()
		let currentNode = this.selMan.getCurrentNode()
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
				this.onPressBackspace(e)
			}

			// Backspace
			// this.postEditor.selManager.backspace(e)
			// this.onPressBackspace(e)

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
				this.onPressDelete(e)
			}

		} else if (keyCode === 13) {

			// Enter(Return)
			e.preventDefault()
			this.onPressEnter(e)

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

		} else {

		}

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

		let currentRange = this.selMan.getCurrentRange()

		if (!currentRange) return
		let currentNode = this.selMan.getCurrentNode()
		if (!currentNode) {
			return
		}
		let br = currentNode.textElement.querySelector("br")
		if (currentNode && currentNode.textElement.textContent !== "" && br) {

			console.log('removed br')
			currentNode.textElement.removeChild(br)

		} else if (currentNode && currentNode.textElement.textContent === "" && !br) {

			currentNode.textElement.appendChild(document.createElement("br"))

		}

		// Image block controlling
		if (currentNode.type === "FIGURE") {

			if (currentNode.textContent === "") {

				currentNode.dom.classList.remove("caption-enabled")

			} else {

				currentNode.dom.classList.add("caption-enabled")

			}

		}


		// Generates a list when types "- " or "1. "

		if (
			currentNode && currentNode.getTextContent().match(/^- /) && AT.isParagraph(currentNode.type) ||
			currentNode && currentNode.getTextContent().match(/^1. /) && AT.isParagraph(currentNode.type)
		) {
			let parentType = "ul"
			if (currentNode.getTextContent().match(/^1. /)) {
				parentType = "ol"
			}
			this.nodeMan.transformNode(currentNode, "li", true, parentType)
			currentNode.textElement.innerHTML = currentNode.textElement.innerHTML.replace(/^- /, "")
			currentNode.textElement.innerHTML = currentNode.textElement.innerHTML.replace(/^1. /, "")
			currentNode.fixEmptiness()
			this.selMan.setRange(this.selMan.createRange(currentNode, 0, currentNode, 0))
		}

		// if (currentNode && currentNode.textContent.match(/^- /) && this.postEditor.selManager.isParagraph(currentNode)) {

		// 	let currentNode = this.postEditor.selManager.getNodeInSelection()

		// 	// console.log(currentNode.textContent.match(/^- /))

		// 	currentNode.innerHTML = currentNode.innerHTML.replace(/^- /, "")

		// 	this.postEditor.selManager.list("ul")

		// 	if (this.postEditor.selManager.isTextEmptyNode(currentNode)) {
		// 		currentNode.innerHTML = "<br>"
		// 	}

		// 	this.postEditor.selManager.setCursorAt(currentNode, 0)

		// } else if (currentNode && currentNode.textContent.match(/^1\. /) && this.postEditor.selManager.isParagraph(currentNode)) {

		// 	let currentNode = this.postEditor.selManager.getNodeInSelection()

		// 	// console.log(currentNode.textContent.match(/^- /))

		// 	currentNode.innerHTML = currentNode.innerHTML.replace(/^1\. /, "")

		// 	this.postEditor.selManager.list("ol")

		// 	if (this.postEditor.selManager.isTextEmptyNode(currentNode)) {
		// 		currentNode.innerHTML = "<br>"
		// 	}

		// 	this.postEditor.selManager.setCursorAt(currentNode, 0)

		// }

	}

	onPressEnter(e) {

		e.preventDefault()

		let currentRange = this.selMan.getCurrentRange()
		let currentNode = this.selMan.getCurrentNode()

		let isCollapsed = currentRange.isCollapsed()

		if (isCollapsed) {

			// Selection is collapsed

			let state = currentRange.start.state

			if (state === 1) {

				let newNode = this.nodeMan.createNode(currentNode.type)
				this.nodeMan.insertChildBefore(newNode, currentNode)

			} else if (state === 2) {

				// this.nodeMan.splitElementNode3()
				this.nodeMan.splitNode()

			} else if (state === 3 || state === 4) {

				console.log("3 or 4")

				let newNode = this.nodeMan.createNode("p")
				this.nodeMan.insertChildBefore(newNode, currentNode.nextSibling)
				let newRange = this.selMan.createRange(newNode, 0, newNode, 0)
				this.selMan.setRange(newRange)

			}

		} else {

			// Not collapsed

		}

	}

	/**
	 * @param {KeyboardEvent} e
	 */
	onPressBackspace(e) {

		let currentRange = this.selMan.getCurrentRange()
		let currentNode = this.selMan.getCurrentNode()

		let isCollapsed = currentRange.isCollapsed()

		if (isCollapsed) {

			let state = currentRange.start.state

			if (state === 1 || state === 4) {
				e.preventDefault()
			}

			if (state === 1) {

				let prvs = currentNode.previousSibling

				if (prvs && prvs.getTextContent() === "") {
					this.nodeMan.removeChild(prvs)
				} else if (prvs) {
					let prvsOrgLen = prvs.textElement.textContent.length
					this.nodeMan.mergeNodes(prvs, currentNode)
					let newRange = this.selMan.createRange(prvs, prvsOrgLen, prvs, prvsOrgLen)
					this.selMan.setRange(newRange)
				}

			} else if (state === 4) {

				let prvs = currentNode.previousSibling

				if (prvs) {

					this.nodeMan.removeChild(currentNode)
					let newRange = this.selMan.createRange(prvs, prvs.textElement.textContent.length, prvs, prvs.textElement.textContent.length)
					this.selMan.setRange(newRange)

				} else {

				}

			}

		} else {

		}

	}

	onPressDelete(e) {

		let currentRange = this.selMan.getCurrentRange()
		let currentNode = this.selMan.getCurrentNode()

		let isCollapsed = currentRange.isCollapsed()

		if (isCollapsed) {

			let state = currentRange.start.state

			if (state === 3 || state === 4) {
				e.preventDefault()
			}

			if (state === 3) {

				let next = currentNode.nextSibling
				if (next && next.textElement.textContent === "") {
					this.nodeMan.removeChild(next)
				} else if (next) {
					let nextOrgLen = next.textElement.textContent.length
					this.nodeMan.mergeNodes(currentNode, next)
					this.selMan.setRange(currentRange)
				}

			}

		} else {

		}

	}

	onSelectionChanged() {

		let currentRange = this.selMan.getCurrentRange()
		let currentNode = this.selMan.getCurrentNode()
		if (currentNode) {
			this.editSession.currentState.nodeID = currentNode.id
			this.editSession.currentState.innerHTML = currentNode.textElement.innerHTML
			this.editSession.currentState.range = currentRange
		}

		this.popTool.togglePopTool()

		// console.log(this.selMan.currentState.innerHTML)


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
		// 	this.editSession.togglePopTool()
		// }, 0)



		// // Detect lists and merge them
		// let currentNode = this.postEditor.selManager.getNodeInSelection()
		// if (this.postEditor.selManager.isListItem(currentNode)) {
		// 	console.log("list")
		// }

	}

}
