import { AT } from "./config/AvailableTypes"
import EditSession from "./EditSession"
import NodeManager from "./NodeManager"
import PopTool from "./PopTool"
import PVMRange from "./PVMRange"
import SelectionManager from "./SelectionManager"
import UndoManager from "./UndoManager"
import TypeChecker from "./TypeChecker";

export default class EventManager {
	public static mouseDownStart: boolean
	private static linkRange: Range
	private static charKeyDownLocked: boolean
	private static multipleSpaceLocked: boolean
	private static selectedAll: boolean
	private static isBackspaceKeyPressed: boolean
	private static tempLinkRange: PVMRange

	constructor() {}

	public static attachEvents() {
		// Properties
		let self = this

		this.mouseDownStart = false
		this.linkRange = document.createRange()
		this.charKeyDownLocked = false
		this.multipleSpaceLocked = false
		this.selectedAll = false

		// Event Listeners
		window.addEventListener("click", e => {
			// console.log(e.target)
			// if (e.target.nodeName === "INPUT" && e.target.parentNode.classList.contains("pack")) {
			// 	return
			// } else {
			// 	this.onSelectionChanged()
			// }
		})
		;["mousedown", "touchstart"].forEach(eventName => {
			window.addEventListener(eventName, e => {
				if (!(<Element>e.target).closest("#poptool")) {
					PopTool.hidePopTool()
					this.mouseDownStart = true
				}
			})
		})
		;["mouseup", "touchend"].forEach(eventName => {
			EditSession.editorBody.addEventListener(eventName, e => {
				this.onSelectionChanged()
			})
		})
		;["mouseup", "touchend"].forEach(eventName => {
			window.addEventListener(eventName, e => {
				if (
					this.mouseDownStart &&
					!(<Element>e.target).closest("#editor-body")
				) {
					this.mouseDownStart = false
					this.onSelectionChanged()
				}
			})
		})

		EditSession.editorBody.addEventListener("dragstart", e => {
			e.preventDefault()
		})
		EditSession.editorBody.addEventListener("drop", e => {
			e.preventDefault()
		})

		this.isBackspaceKeyPressed = false

		window.addEventListener("keydown", e => {
			let currentRange = EditSession.currentState.range
			if (e.keyCode === 8 || e.keyCode === 46) {
				if (EditSession.editorBody.querySelector(".image-selected")) {
					console.log("image should be deleted")
					let imageNode = NodeManager.getNodeByID(
						NodeManager.getNodeID(
							EditSession.editorBody.querySelector(".image-selected")
						)
					)
					let nextNode = imageNode.nextSibling
					NodeManager.removeChild(imageNode)
					PopTool.hideImageTool()
					UndoManager.record({
						type: "remove",
						targetNode: imageNode,
						nextNode: nextNode,
						previousRange: currentRange,
						nextRange: currentRange
					})
				}
			}
		})

		EditSession.editorBody.addEventListener("input", e => {
			console.log(e)
		})

		window.addEventListener("keydown", e => {
			if (e.which === 90 && (e.ctrlKey || e.metaKey)) {
				if (e.shiftKey) {
					e.preventDefault()
					UndoManager.redo()
				} else {
					e.preventDefault()
					UndoManager.undo()
				}
			}
		})

		EditSession.editorBody.addEventListener("keydown", e => {
			EventManager.onKeyDown(e)
			if (e.which >= 37 && e.which <= 40) {
				// this.onSelectionChanged()
			}
			if (e.which === 65 && e.ctrlKey) {
				this.selectedAll = true
			}
			if (!(<Element>e.target).closest("#poptool")) {
				PopTool.hidePopTool()
			}
		})

		EditSession.editorBody.addEventListener("keyup", e => {
			EventManager.onKeyUp(e)
			this.onSelectionChanged()

			if (this.selectedAll) {
				this.selectedAll = false
				this.onSelectionChanged()
			}
		})

		EditSession.editorBody.addEventListener("paste", e => {
			// this.onPaste(e)
		})

		// Image click event
		window.addEventListener("click", e => {
			let target = <HTMLElement>e.target

			if (target.classList.contains("image-wrapper")) {
				e.preventDefault()

				var selectedFigure = EditSession.editorBody.querySelector(
					"figure.image-selected"
				)
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected")
				}

				var figure = target.parentElement
				figure.classList.remove("caption-selected")
				figure.classList.add("image-selected")
				figure.classList.add("node-focused")
				PopTool.showImageTool(target)

				if (figure.querySelector("FIGCAPTION").textContent.length === 0) {
					figure.querySelector("FIGCAPTION").innerHTML = "이미지 설명"
				}

				window.getSelection().removeAllRanges()
			} else if (target.id === "full" && target.nodeName === "BUTTON") {
				let selectedFigure = EditSession.editorBody.querySelector(
					"figure.image-selected"
				)
				selectedFigure.className = "image image-selected"
				selectedFigure.classList.add("full")
				PopTool.hideImageTool()
				setTimeout(() => {
					PopTool.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)
			} else if (target.id === "fit" && target.nodeName === "BUTTON") {
				var selectedFigure = EditSession.editorBody.querySelector(
					"figure.image-selected"
				)
				selectedFigure.className = "image image-selected"
				PopTool.hideImageTool()
				setTimeout(() => {
					PopTool.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)
			} else if (target.id === "large" && target.nodeName === "BUTTON") {
				let selectedFigure = EditSession.editorBody.querySelector(
					"figure.image-selected"
				)
				selectedFigure.className = "image image-selected"
				selectedFigure.classList.add("large")
				PopTool.hideImageTool()
				setTimeout(() => {
					PopTool.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)
			} else if (target.id === "float-left" && target.nodeName === "BUTTON") {
				let selectedFigure = EditSession.editorBody.querySelector(
					"figure.image-selected"
				)
				selectedFigure.className = "image image-selected"
				selectedFigure.classList.add("float-left")
				PopTool.hideImageTool()
				setTimeout(() => {
					PopTool.showImageTool(selectedFigure.querySelector(".image-wrapper"))
				}, 500)
			} else if (target.nodeName === "FIGCAPTION") {
				target.parentElement.classList.add("caption-selected")
				target.parentElement.classList.remove("image-selected")
				PopTool.hideImageTool()
				if (!target.parentElement.classList.contains("caption-enabled")) {
					target.innerHTML = "<br>"
				}
			} else if (
				target.nodeName === "INPUT" &&
				target.parentElement.classList.contains("pack")
			) {
				// console.log("clicked poptool input")
			} else {
				var selectedFigure = EditSession.editorBody.querySelector(
					"figure.image-selected, figure.caption-selected"
				)
				if (selectedFigure) {
					selectedFigure.classList.remove("image-selected")
					selectedFigure.classList.remove("node-focused")
					selectedFigure.classList.remove("caption-selected")
				}

				PopTool.hideImageTool()
			}

			this.onSelectionChanged()
		})

		window.addEventListener("mousedown", e => {
			let target = <Element>e.target
			if (target.classList.contains("image-wrapper")) {
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

	public static attachPopToolEvents() {
		let self = this

		window.addEventListener("mousedown", e => {
			let target = <Element>e.target
			if (
				!target.classList.contains("operation") &&
				!target.closest("button .operation")
			) {
				PopTool.hidePopTool()
			}
		})

		window.addEventListener("resize", e => {
			PopTool.showImageTool(document.querySelector(".image.image-selected img"))
			PopTool.showPopTool()
		})

		EditSession.editorBody.addEventListener("mouseup", e => {
			setTimeout(() => {
				PopTool.togglePopTool()
			}, 0)
		})

		EditSession.editorBody.addEventListener("keyup", e => {
			let keyCode = e.which
			if (
				keyCode === 37 ||
				keyCode === 38 ||
				keyCode === 39 ||
				keyCode === 40
			) {
				PopTool.togglePopTool()
			}
		})

		PopTool.pt.querySelectorAll("button").forEach(elm => {
			elm.addEventListener("click", () => {
				let currentRange = SelectionManager.getCurrentRange()
				if (!currentRange.start.node && !currentRange.end.node) {
					PopTool.hidePopTool()
				}
			})
		})

		// PopTool.pt.querySelector("#pt-p").addEventListener('click', (e) => { this.postEditor.selManager.heading('P') })
		PopTool.pt.querySelector("#pt-h1").addEventListener("click", e => {
			PopTool.transformNodes("h1")
		})
		PopTool.pt.querySelector("#pt-h2").addEventListener("click", e => {
			PopTool.transformNodes("h2")
		})
		PopTool.pt.querySelector("#pt-h3").addEventListener("click", e => {
			PopTool.transformNodes("h3")
		})
		PopTool.pt.querySelector("#pt-bold").addEventListener("click", e => {
			PopTool.changeTextStyle("bold")
		})
		PopTool.pt.querySelector("#pt-italic").addEventListener("click", e => {
			PopTool.changeTextStyle("italic")
		})
		PopTool.pt.querySelector("#pt-underline").addEventListener("click", e => {
			PopTool.changeTextStyle("underline")
		})
		PopTool.pt.querySelector("#pt-strike").addEventListener("click", e => {
			PopTool.changeTextStyle("strikethrough")
		})
		PopTool.pt.querySelector("#pt-alignleft").addEventListener("click", e => {
			PopTool.align("left")
		})
		PopTool.pt.querySelector("#pt-alignmiddle").addEventListener("click", e => {
			PopTool.align("center")
		})
		PopTool.pt.querySelector("#pt-alignright").addEventListener("click", e => {
			PopTool.align("right")
		})

		PopTool.pt.querySelector("#pt-title-pack").addEventListener("click", e => {
			PopTool.pt.querySelector(".top-categories").classList.add("hidden")
			PopTool.pt.querySelector(".title-style").classList.remove("hidden")
			PopTool.showPopTool()
		})

		PopTool.pt
			.querySelector("#pt-textstyle-pack")
			.addEventListener("click", e => {
				PopTool.pt.querySelector(".top-categories").classList.add("hidden")
				PopTool.pt.querySelector(".text-style").classList.remove("hidden")
				PopTool.showPopTool()
			})

		PopTool.pt.querySelector("#pt-align-pack").addEventListener("click", e => {
			PopTool.pt.querySelector(".top-categories").classList.add("hidden")
			PopTool.pt.querySelector(".align").classList.remove("hidden")
			PopTool.showPopTool()
		})

		PopTool.pt.querySelector("#pt-link").addEventListener("click", e => {
			PopTool.pt.querySelector(".top-categories").classList.add("hidden")
			PopTool.pt.querySelector(".input").classList.remove("hidden")
			PopTool.showPopTool()

			this.tempLinkRange = SelectionManager.getCurrentRange()

			setTimeout(() => {
				;(<HTMLElement>document.querySelector(".pack.input input")).focus()
			}, 0)
		})

		PopTool.pt
			.querySelector(".pack.input input")
			.addEventListener("keydown", function(e: KeyboardEvent) {
				if (e.keyCode === 13) {
					e.preventDefault()
					PopTool.hidePopTool()
					// self.sel.setRange(self.tempLinkRange)
					// self.postEditor.selManager.link(this.value)
					setTimeout(() => {
						this.value = ""
					}, 200)
				}
			})

		PopTool.pt.querySelector("#pt-blockquote").addEventListener("click", e => {
			PopTool.transformNodes("blockquote")
		})

		PopTool.pt.querySelectorAll(".pack button").forEach(elm => {
			elm.addEventListener("click", () => {
				PopTool.showPopTool()
			})
		})
	}

	// Events

	/**
	 *
	 * @param {KeyboardEvent} e
	 */
	// onPaste(e: KeyboardEvent) {

	// 	let originalRange = this.postEditor.selManager.getRange()
	// 	if (!originalRange) {
	// 		return
	// 	}

	// 	let pasteArea = EditSession.editorDOM.querySelector("#paste-area")
	// 	// let pasteArea = document.createElement("div")

	// 	pasteArea.innerHTML = ""

	// 	let range = document.createRange()
	// 	range.setStart(pasteArea, 0)
	// 	range.collapse(true)

	// 	window.getSelection().removeAllRanges()
	// 	window.getSelection().addRange(range)

	// 	setTimeout(() => {

	// 		window.getSelection().removeAllRanges()
	// 		window.getSelection().addRange(originalRange)
	// 		this.postEditor.selManager.removeSelection("start")

	// 		// let originalCurrentNode = this.postEditor.selManager.getNodeInSelection()
	// 		let originalCurrentNode = SelectionManager.getno
	// 		let lastPastedNode      = originalCurrentNode

	// 		var node, travelNode, nextNode
	// 		node       = pasteArea.firstChild
	// 		travelNode = pasteArea.firstChild

	// 		var metTop    = false
	// 		let firstNode = true

	// 		// Loop all node and analyze
	// 		while (1) {
	// 			// if (!node) {
	// 			// 	return
	// 			// }
	// 			// for (var i = node.attributes.length - 1 i >= 0 i--){
	// 			// 	node.removeAttribute(node.attributes[i].name)
	// 			// }
	// 			// node = node.nextSibling

	// 			if (!travelNode) {
	// 				break
	// 			} else {

	// 				// console.log(travelNode)

	// 				let clonedTravelNode = travelNode.cloneNode(true)

	// 				// console.log(lastPastedNode)

	// 				// If the node is available node, paste it into the editor
	// 				if (
	// 					this.postEditor.selManager.isParagraph(travelNode) ||
	// 					this.postEditor.selManager.isHeading(travelNode) ||
	// 					this.postEditor.selManager.isBlockquote(travelNode) ||
	// 					this.postEditor.selManager.isList(travelNode)
	// 				) {

	// 					if (firstNode) {

	// 						                        firstNode = false
	// 						                    let tn        = document.createTextNode(clonedTravelNode.textContent)
	// 						originalRange.insertNode(tn)

	// 						let range = document.createRange()
	// 						range.setStartAfter(tn)
	// 						window.getSelection().removeAllRanges()
	// 						window.getSelection().addRange(range)

	// 					} else {

	// 						EditSession.editorBody.insertBefore(clonedTravelNode, lastPastedNode.nextSibling)
	// 						lastPastedNode = clonedTravelNode

	// 						let range = document.createRange()
	// 						range.setStartAfter(clonedTravelNode)
	// 						window.getSelection().removeAllRanges()
	// 						window.getSelection().addRange(range)

	// 					}

	// 					// No need to loop through the node
	// 					travelNode = travelNode.nextSibling
	// 					continue

	// 				} else if (travelNode.nodeType === 3) { // Reached the textNode in the deepest node

	// 					if (firstNode) {

	// 						                        firstNode = false
	// 						                    let tn        = document.createTextNode(clonedTravelNode.textContent)
	// 						originalRange.insertNode(tn)

	// 						let range = document.createRange()
	// 						range.setStartAfter(tn)
	// 						window.getSelection().removeAllRanges()
	// 						window.getSelection().addRange(range)

	// 					} else {

	// 						let p           = EditSession.generateEmptyNode("p")
	// 						    p.innerHTML = travelNode.textContent
	// 						EditSession.editorBody.insertBefore(p, lastPastedNode.nextSibling)

	// 						let range = document.createRange()
	// 						range.setStartAfter(p)
	// 						window.getSelection().removeAllRanges()
	// 						window.getSelection().addRange(range)

	// 					}

	// 				}

	// 				if (travelNode.attributes) {
	// 					for (var i = travelNode.attributes.length - 1; i >= 0; i--) {
	// 						if (
	// 							travelNode.nodeName === "IMG" && travelNode.attributes[i].name === "src"
	// 						) {
	// 							continue
	// 						}
	// 						travelNode.removeAttribute(travelNode.attributes[i].name)
	// 					}
	// 				}

	// 				if (travelNode.firstChild) {
	// 					travelNode = travelNode.firstChild
	// 				} else if (travelNode.nextSibling) {
	// 					travelNode = travelNode.nextSibling
	// 				} else {
	// 					while (true) {
	// 						travelNode = travelNode.parentNode
	// 						if (travelNode === pasteArea) {
	// 							metTop = true
	// 						}
	// 						if (travelNode.nextSibling) {
	// 							travelNode = travelNode.nextSibling
	// 							break
	// 						}
	// 					}
	// 				}
	// 			}

	// 			if (metTop) {
	// 				break
	// 			}

	// 		}

	// 		// pasteArea.innerHTML = ""

	// 	}, 1)

	// }

	/**
	 * @param {KeyboardEvent} e
	 */
	public static onKeyDown(e: KeyboardEvent) {
		let keyCode = e.keyCode
		let physKeyCode = e.code
		// Prevent Hangul compositionEnd + spacebar
		if (physKeyCode === "Space" && e.key === "Process") return

		let currentRange = SelectionManager.getCurrentRange()
		let currentNode = SelectionManager.getCurrentNode()
		if (!currentNode) return

		// This flag determines the availability of
		// changing text.
		let enableTextChangeRecord = false

		let key = "char"
		// When press a key where it puts any space inside the editor,
		// this variable is true.
		// let validCharKey =
		// 	((keyCode > 47 && keyCode < 58) || // number keys
		// 		keyCode === 32 || // spacebar & return key(s) (if you want to allow carriage returns)
		// 		(keyCode > 64 && keyCode < 91) || // letter keys
		// 		(keyCode > 95 && keyCode < 112) || // numpad keys
		// 		(keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
		// 		(keyCode > 218 && keyCode < 223) || // [\]' (in order)
		// 		(keyCode === 229 && physKeyCode !== "Lang1"))
		// 	&& !e.ctrlKey && !e.metaKey

		let validCharKey =
			(physKeyCode === "KeyA" ||
				physKeyCode === "KeyB" ||
				physKeyCode === "KeyC" ||
				physKeyCode === "KeyD" ||
				physKeyCode === "KeyE" ||
				physKeyCode === "KeyF" ||
				physKeyCode === "KeyG" ||
				physKeyCode === "KeyH" ||
				physKeyCode === "KeyI" ||
				physKeyCode === "KeyJ" ||
				physKeyCode === "KeyK" ||
				physKeyCode === "KeyL" ||
				physKeyCode === "KeyM" ||
				physKeyCode === "KeyN" ||
				physKeyCode === "KeyO" ||
				physKeyCode === "KeyP" ||
				physKeyCode === "KeyQ" ||
				physKeyCode === "KeyR" ||
				physKeyCode === "KeyS" ||
				physKeyCode === "KeyT" ||
				physKeyCode === "KeyU" ||
				physKeyCode === "KeyV" ||
				physKeyCode === "KeyW" ||
				physKeyCode === "KeyX" ||
				physKeyCode === "KeyY" ||
				physKeyCode === "KeyZ" ||
				physKeyCode === "Digit0" ||
				physKeyCode === "Digit1" ||
				physKeyCode === "Digit2" ||
				physKeyCode === "Digit3" ||
				physKeyCode === "Digit4" ||
				physKeyCode === "Digit5" ||
				physKeyCode === "Digit6" ||
				physKeyCode === "Digit7" ||
				physKeyCode === "Digit8" ||
				physKeyCode === "Digit9" ||
				physKeyCode === "Numpad0" ||
				physKeyCode === "Numpad1" ||
				physKeyCode === "Numpad2" ||
				physKeyCode === "Numpad3" ||
				physKeyCode === "Numpad4" ||
				physKeyCode === "Numpad5" ||
				physKeyCode === "Numpad6" ||
				physKeyCode === "Numpad7" ||
				physKeyCode === "Numpad8" ||
				physKeyCode === "Numpad9" ||
				physKeyCode === "NumpadDecimal" ||
				physKeyCode === "NumpadDivide" ||
				physKeyCode === "NumpadMultiply" ||
				physKeyCode === "NumpadSubtract" ||
				physKeyCode === "NumpadAdd" ||
				physKeyCode === "Backquote" ||
				physKeyCode === "Minus" ||
				physKeyCode === "Equal" ||
				physKeyCode === "Backslash" ||
				physKeyCode === "BracketLeft" ||
				physKeyCode === "BracketRight" ||
				physKeyCode === "Semicolon" ||
				physKeyCode === "Quote" ||
				physKeyCode === "Comma" ||
				physKeyCode === "Period" ||
				physKeyCode === "Slash" ||
				physKeyCode === "Space") &&
			!e.ctrlKey &&
			!e.metaKey

		// Backspace key (delete on macOS)
		if (keyCode === 8) {
			setTimeout(() => {
				NodeManager.normalize(currentNode.textElement)
				if (currentNode.textElement.textContent.length === 0) {
					let brs = currentNode.textElement.querySelectorAll("br")
					if (brs.length > 1) {
						for (let i = 0; i < brs.length - 1; i++) {
							brs[i].parentNode.removeChild(brs[i])
						}
					} else if (brs.length === 0) {
						currentNode.textElement.appendChild(document.createElement("br"))
					}
				}
			}, 1)

			if (
				currentRange &&
				currentRange.isCollapsed() &&
				(currentRange.start.state !== 1 && currentRange.start.state !== 4)
			) {
				enableTextChangeRecord = true
				key = "backspace"
			} else {
				enableTextChangeRecord = false
				EventManager.onPressBackspace(e)
			}
		} else if (keyCode === 46) {
			// Delete key (fn + delete on macOS)

			if (
				currentRange &&
				currentRange.isCollapsed() &&
				(currentRange.start.state !== 3 && currentRange.start.state !== 4)
			) {
				enableTextChangeRecord = true
				key = "delete"
			} else {
				enableTextChangeRecord = false
				EventManager.onPressDelete(e)
			}
		} else if (keyCode === 13) {
			// Enter key (return on macOS)

			// Enter(Return)
			e.preventDefault()
			EventManager.onPressEnter(e)
		} else if (keyCode === 90 && e.ctrlKey) {
			// cmd + z (deprecated)
			// e.preventDefault()
			// this.ssManager.undo()
		}

		if (validCharKey || enableTextChangeRecord) {
			if (
				window.getSelection().rangeCount > 0 &&
				!window.getSelection().getRangeAt(0).collapsed
			) {
				SelectionManager.removeSelection("backspace")
			}

			this.charKeyDownLocked = true

			let originalContents = EditSession.currentState.textHTML
			let originalRange = EditSession.currentState.range
			let modifiedContents, newRange

			setTimeout(() => {
				modifiedContents = currentNode.textElement.innerHTML
				newRange = SelectionManager.getCurrentRange()

				let latestAction = UndoManager.getLatestAction()
				if (
					latestAction &&
					!Array.isArray(latestAction) &&
					latestAction.type === "textChange" &&
					latestAction.key === key &&
					physKeyCode !== "Space"
				) {
					latestAction.nextHTML = modifiedContents
					latestAction.nextRange = newRange
					console.group("continue record")
					// console.log(modifiedContents)
					// console.log(newRange)
					console.groupEnd()
				} else {
					console.group("new record")
					// console.log(originalContents)
					// console.log(originalRange)
					console.groupEnd()
					UndoManager.record({
						type: "textChange",
						previousHTML: originalContents,
						nextHTML: modifiedContents,
						targetNode: currentNode,
						previousRange: originalRange,
						nextRange: newRange,
						key: key
					})
				}
			}, 4)
		} else {
		}

		// Image block controlling
		setTimeout(() => {
			if (currentNode.type === "image") {
				if (currentNode.getTextContent() === "") {
					currentNode.element.classList.remove("caption-enabled")
				} else {
					currentNode.element.classList.add("caption-enabled")
				}
			}
		}, 4)
	}

	/**
	 * Fires when press keyboard inside the editor.
	 */
	public static onKeyUp(e: KeyboardEvent) {
		// console.log("keyup")

		let keyCode = e.keyCode
		let physKeyCode = e.code

		let currentRange = SelectionManager.getCurrentRange()

		if (!currentRange) return
		let currentNode = SelectionManager.getCurrentNode()
		if (!currentNode) {
			return
		}

		// Image block controlling
		if (currentNode.type === "FIGURE") {
			if (currentNode.getTextContent() === "") {
				currentNode.element.classList.remove("caption-enabled")
			} else {
				currentNode.element.classList.add("caption-enabled")
			}
		}

		// Generates a list when types "- " or "1. "
		if (
			keyCode === 32 &&
			TypeChecker.isParagraph(currentNode.type) &&
			currentNode &&
			(currentNode.getTextContent().match(/^- /) ||
				currentNode.getTextContent().match(/^1\. /))
		) {
			console.log("here")
			let parentType = "ul"
			if (currentNode.getTextContent().match(/^1\. /)) {
				parentType = "ol"
			}
			let originalType = currentNode.type
			let originalParentType = currentNode.parentType
			NodeManager.transformNode(currentNode, "li", parentType)
			currentNode.fixEmptiness()
			let newRange = SelectionManager.createRange(
				currentNode,
				0,
				currentNode,
				0
			)
			SelectionManager.setRange(newRange)
			UndoManager.record({
				type: "transform",
				targetNode: currentNode,
				previousType: originalType,
				previousParentType: originalParentType,
				nextType: "li",
				nextParentType: parentType,
				previousRange: newRange,
				nextRange: newRange
			})
		}
	}

	public static onPressEnter(e: KeyboardEvent, finalAction: boolean = false) {
		e.preventDefault()

		let currentRange = SelectionManager.getCurrentRange()
		let currentNode = SelectionManager.getCurrentNode()

		if (currentRange && currentRange.isCollapsed()) {
			// Selection is collapsed

			let state = currentRange.start.state

			if (state === 1) {
				let newNode = NodeManager.createNode(currentNode.type)
				NodeManager.insertChildBefore(newNode, currentNode)
				UndoManager.record({
					type: "insert",
					targetNode: newNode,
					nextNode: currentNode,
					previousRange: currentRange,
					nextRange: currentRange,
					finalAction: finalAction
				})
			} else if (state === 2) {
				let newNode = NodeManager.splitNode()
				let newRange = SelectionManager.createRange(newNode, 0, newNode, 0)
				SelectionManager.setRange(newRange)
				UndoManager.record({
					type: "split",
					debris: currentNode.textElement.innerHTML,
					targetNodes: [currentNode, newNode],
					previousRange: currentRange,
					nextRange: newRange,
					finalAction: finalAction
				})
			} else if (state === 3 || state === 4) {
				let newNode
				if (currentNode.type === "li") {
					if (state === 3) {
						newNode = NodeManager.createNode("LI", {
							parentType: currentNode.parentType
						})
					} else if (state === 4) {
						let originalType = currentNode.type
						let originalParentType = currentNode.parentType
						NodeManager.transformNode(currentNode, "p")
						SelectionManager.setRange(currentRange)
						UndoManager.record({
							type: "transform",
							targetNode: currentNode,
							previousType: originalType,
							previousParentType: originalParentType,
							nextType: "p",
							nextParentType: null,
							previousRange: currentRange,
							nextRange: currentRange
						})
						return
					}
				} else if (currentNode.type === "blockquote") {
					if (state === 4) {
						let originalType = currentNode.type
						let originalParentType = currentNode.parentType
						NodeManager.transformNode(currentNode, "p")
						SelectionManager.setRange(currentRange)
						UndoManager.record({
							type: "transform",
							targetNode: currentNode,
							previousType: originalType,
							previousParentType: originalParentType,
							nextType: "p",
							nextParentType: null,
							previousRange: currentRange,
							nextRange: currentRange
						})
						return
					} else {
						newNode = NodeManager.createNode("p")
					}
				} else {
					newNode = NodeManager.createNode("p")
				}
				let nextNode = currentNode.nextSibling
				NodeManager.insertChildBefore(newNode, nextNode)
				let newRange = SelectionManager.createRange(newNode, 0, newNode, 0)
				SelectionManager.setRange(newRange)
				UndoManager.record({
					type: "insert",
					targetNode: newNode,
					nextNode: nextNode,
					previousRange: currentRange,
					nextRange: newRange,
					finalAction: finalAction
				})
			}
		} else {
			// Not collapsed

			SelectionManager.removeSelection("enter")
		}
	}

	public static onPressBackspace(
		e: KeyboardEvent,
		finalAction: boolean = false
	) {
		let currentRange = SelectionManager.getCurrentRange()
		let currentNode = SelectionManager.getCurrentNode()

		if (currentRange && currentRange.isCollapsed()) {
			let state = currentRange.start.state

			if (state === 1 || state === 4) {
				e.preventDefault()
				if (!AT.mergeable.includes(currentNode.type)) {
					return
				}
			}

			if (state === 1) {
				if (currentNode.type === "li") {
					let originalType = currentNode.type
					let originalParentType = currentNode.parentType
					NodeManager.transformNode(currentNode, "p")
					SelectionManager.setRange(currentRange)
					UndoManager.record({
						type: "transform",
						targetNode: currentNode,
						previousType: originalType,
						previousParentType: originalParentType,
						nextType: "p",
						nextParentType: null,
						previousRange: currentRange,
						nextRange: currentRange
					})
					return
				}

				let prvs = currentNode.previousSibling

				if (!AT.mergeable.includes(prvs.type)) {
					NodeManager.removeChild(prvs)
					UndoManager.record({
						type: "remove",
						targetNode: prvs,
						nextNode: currentNode,
						previousRange: currentRange,
						nextRange: currentRange,
						finalAction: finalAction
					})
				} else {
					if (prvs && prvs.getTextContent() === "") {
						NodeManager.removeChild(prvs)
						UndoManager.record({
							type: "remove",
							targetNode: prvs,
							nextNode: currentNode,
							previousRange: currentRange,
							nextRange: currentRange,
							finalAction: finalAction
						})
					} else if (prvs) {
						let prvsOrgLen = prvs.textElement.textContent.length
						let originalContents = prvs.textElement.innerHTML
						NodeManager.mergeNodes(prvs, currentNode)
						let newRange = SelectionManager.createRange(
							prvs,
							prvsOrgLen,
							prvs,
							prvsOrgLen
						)
						SelectionManager.setRange(newRange)
						UndoManager.record({
							type: "merge",
							targetNodes: [prvs, currentNode],
							debris: originalContents,
							previousRange: currentRange,
							nextRange: newRange,
							finalAction: finalAction
						})
					}
				}
			} else if (state === 4) {
				if (currentNode.type === "li") {
					let originalType = currentNode.type
					let originalParentType = currentNode.parentType
					NodeManager.transformNode(currentNode, "p")
					SelectionManager.setRange(currentRange)
					UndoManager.record({
						type: "transform",
						targetNode: currentNode,
						previousType: originalType,
						previousParentType: originalParentType,
						nextType: "p",
						nextParentType: null,
						previousRange: currentRange,
						nextRange: currentRange
					})
					return
				}

				let prvs = currentNode.previousSibling

				if (prvs) {
					let nextNode = currentNode.nextSibling
					NodeManager.removeChild(currentNode)
					let newRange = SelectionManager.createRange(
						prvs,
						prvs.textElement.textContent.length,
						prvs,
						prvs.textElement.textContent.length
					)
					SelectionManager.setRange(newRange)
					UndoManager.record({
						type: "remove",
						targetNode: currentNode,
						nextNode: nextNode,
						previousRange: currentRange,
						nextRange: newRange,
						finalAction: finalAction
					})
				} else {
				}
			}
		} else {
			// selection is not collapsed
			e.preventDefault()
			SelectionManager.removeSelection()
		}
	}

	public static onPressDelete(e: KeyboardEvent) {
		let currentRange = SelectionManager.getCurrentRange()
		let currentNode = SelectionManager.getCurrentNode()

		if (currentRange && currentRange.isCollapsed()) {
			let state = currentRange.start.state

			if (state === 3 || state === 4) {
				e.preventDefault()
				if (!AT.mergeable.includes(currentNode.type)) {
					return
				}
			}

			if (state === 3) {
				let next = currentNode.nextSibling
				let nextNext = next.nextSibling

				if (!AT.mergeable.includes(next.type)) {
					NodeManager.removeChild(next)
					UndoManager.record({
						type: "remove",
						targetNode: next,
						nextNode: nextNext,
						previousRange: currentRange,
						nextRange: currentRange
					})
				} else {
					if (next && next.getTextContent() === "") {
						NodeManager.removeChild(next)
						UndoManager.record({
							type: "remove",
							targetNode: next,
							nextNode: nextNext,
							previousRange: currentRange,
							nextRange: currentRange
						})
					} else if (next) {
						let nextOrgLen = next.textElement.textContent.length
						let originalContents = currentNode.textElement.innerHTML
						NodeManager.mergeNodes(currentNode, next)
						SelectionManager.setRange(currentRange)
						UndoManager.record({
							type: "merge",
							targetNodes: [currentNode, next],
							debris: originalContents,
							previousRange: currentRange,
							nextRange: currentRange
						})
					}
				}
			} else if (state === 4) {
				let nextNode = currentNode.nextSibling
				if (nextNode) {
					NodeManager.removeChild(currentNode)
					let newRange = SelectionManager.createRange(nextNode, 0, nextNode, 0)
					SelectionManager.setRange(newRange)
					UndoManager.record({
						type: "remove",
						targetNode: currentNode,
						nextNode: nextNode,
						previousRange: currentRange,
						nextRange: newRange
					})
				}
			}
		} else {
			// selection is not collapsed
			e.preventDefault()
			SelectionManager.removeSelection()
		}
	}

	public static onSelectionChanged() {
		if (window.getSelection().rangeCount === 0) {
			return
		}

		// Fix selection
		let jsRange = window.getSelection().getRangeAt(0)
		let newStartContainer, newEndContainer, newStartOffset, newEndOffset
		let needsFix = false

		let pvmRange = SelectionManager.getCurrentRange()
		if (pvmRange.start.node.type === "image") {
			pvmRange.start.node.element.classList.add("image-selected")
		}

		// console.log(jsRange)
		console.log(SelectionManager.getCurrentRange())

		// console.log(pvmRange)
		// console.log(pvmRange.isCollapsed())

		// set new start
		if (
			jsRange.startContainer.nodeType !== 3 &&
			jsRange.startContainer.childNodes.length > 0
		) {
			needsFix = true

			newStartContainer = jsRange.startContainer.childNodes[jsRange.startOffset]
			newStartOffset = 0

			while (1) {
				if (!newStartContainer) {
					break
				}
				if (newStartContainer.firstChild) {
					if (newStartContainer.firstChild.nodeType === 3) {
						newStartContainer = newStartContainer.firstChild
						break
					} else {
						newStartContainer = newStartContainer.firstChild
						newStartOffset = newStartContainer.childNodes.length
					}
				} else {
					break
				}
			}

			if (newStartContainer.nodeName === "BR") {
				jsRange.setStartBefore(newStartContainer)
			} else {
				jsRange.setStart(newStartContainer, newStartOffset)
			}

			// If <br> tag is set
			// setstartbefore occurs an error
			// so reset it.
			// if (jsRange.startContainer.nodeType === 3) {
			// 	jsRange.setStart(jsRange.startContainer, 0)
			// }
		}

		// set new end
		if (
			jsRange.endContainer.nodeType !== 3 &&
			jsRange.endContainer.childNodes.length > 0
		) {
			needsFix = true

			let ofs = jsRange.endOffset - 1
			// console.log(jsRange.endOffset)
			if (ofs < 0) {
				ofs = 0
				newEndContainer = jsRange.endContainer.childNodes[ofs]
				newEndOffset = 0
			} else {
				newEndContainer = jsRange.endContainer.childNodes[ofs]
				newEndOffset = newEndContainer.childNodes.length
			}

			// console.log(newEndOffset)

			while (1) {
				if (!newEndContainer) {
					break
				}
				if (newEndContainer.lastChild) {
					if (newEndContainer.lastChild.nodeType === 3) {
						newEndContainer = newEndContainer.lastChild
						newEndOffset = newEndContainer.textContent.length
						if (jsRange.endOffset === 0) {
							newEndOffset = 0
						}
						break
					} else {
						newEndContainer = newEndContainer.lastChild
						newEndOffset = newEndContainer.childNodes.length
						if (jsRange.endOffset === 0) {
							newEndOffset = 0
						}
					}
				} else {
					break
				}
			}

			// if (newEndContainer.nodeName === "BR") {
			// 	jsRange.setEndBefore(newEndContainer)
			// } else {
			// 	jsRange.setEnd(newEndContainer, newEndOffset)
			// }

			// If <br> tag is set
			// setstartbefore occurs an error
			// so reset it.
			// if (jsRange.endContainer.nodeType === 3) {
			// 	jsRange.setEnd(jsRange.endContainer, jsRange.endContainer.textContent.length)
			// }
		}

		if (needsFix) {
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(jsRange)
		}

		// if (!pvmRange.isCollapsed()) {
		// 	if (pvmRange.start.state === 3 || pvmRange.start.state === 4) {
		// 		pvmRange.setStart(pvmRange.start.node.nextSibling, 0)
		// 	}
		// 	if (pvmRange.end.state === 1 || pvmRange.end.state === 4) {
		// 		pvmRange.setEnd(pvmRange.end.node.previousSibling, pvmRange.end.node.previousSibling.getTextContent().length)
		// 	}
		// 	console.log("here")
		// 	SelectionManager.setRange(pvmRange)
		// }

		let currentRange = SelectionManager.getCurrentRange()
		let currentNode = SelectionManager.getCurrentNode()

		PopTool.togglePopTool()

		EditSession.currentState.node = currentNode
		EditSession.currentState.range = currentRange
		if (currentNode && currentNode.textElement) {
			EditSession.currentState.textHTML = currentNode.textElement.innerHTML
		}
	}
}
