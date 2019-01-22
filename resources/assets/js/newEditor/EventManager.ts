import { AT } from "./AvailableTypes"
import EditSession from "./EditSession"
import NodeManager from "./NodeManager"
import PopTool from "./PopTool"
import PVMRange from "./PVMRange"
import SelectionManager from "./SelectionManager"
import UndoManager from "./UndoManager"
import TypeChecker from "./TypeChecker"
import PVMImageNode from "./PVMImageNode"
import PVMNode from "./PVMNode"
import Converter from "./Converter"

export interface SelectionChangeEvent extends CustomEvent {
	detail: {
		currentRange: PVMRange
	}
}

export default class EventManager {
	public static mouseDownStart: boolean
	private static linkRange: Range
	private static charKeyDownLocked: boolean
	private static multipleSpaceLocked: boolean
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

		// document.addEventListener("selectionchange", e => {
		// 	this.onSelectionChanged()
		// })

		EditSession.editorBody.addEventListener("dragstart", e => {
			e.preventDefault()
		})
		EditSession.editorBody.addEventListener("drop", e => {
			e.preventDefault()
		})

		this.isBackspaceKeyPressed = false

		EditSession.editorBody.addEventListener("input", e => {
			// console.log(e)
		})

		EditSession.editorBody.addEventListener("compositionupdate", e => {
			let currentNode = SelectionManager.getCurrentNode()

			setTimeout(() => {
				let modifiedContents = currentNode.textElement.innerHTML
				let newRange = SelectionManager.getCurrentRange()
				
				let latestAction = UndoManager.getLatestAction()
				if (
					latestAction &&
					!Array.isArray(latestAction) &&
					latestAction.type === "textChange" &&
					latestAction.key === "char"
				) {
					latestAction.nextHTML = modifiedContents
					latestAction.nextRange = newRange
					console.group("continue record")
					console.groupEnd()
				}
			}, 4);
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
			this.onKeyDown(e)

			if (!(<Element>e.target).closest("#poptool")) {
				PopTool.hidePopTool()
			}

			setTimeout(() => {
				this.onSelectionChanged()
			}, 0)
		})

		EditSession.editorBody.addEventListener("keyup", e => {
			this.onKeyUp(e)
			// this.onSelectionChanged()
		})

		EditSession.editorBody.addEventListener("paste", e => {
			this.onPaste(e)
		})

		// Packed with all window click events.
		window.addEventListener("click", e => {
			let target = <HTMLElement> e.target

			if (target.id === "full" && target.nodeName === "BUTTON") {
				let currentNode = SelectionManager.getCurrentNode()
				if (currentNode instanceof PVMImageNode) {
					currentNode.setKind("full")
				}
			} else if (target.id === "fit" && target.nodeName === "BUTTON") {
				let currentNode = SelectionManager.getCurrentNode()
				if (currentNode instanceof PVMImageNode) {
					currentNode.setKind("fit")
				}			
			} else if (target.id === "large" && target.nodeName === "BUTTON") {
				let currentNode = SelectionManager.getCurrentNode()
				if (currentNode instanceof PVMImageNode) {
					currentNode.setKind("large")
				}
			} else if (target.id === "float-left" && target.nodeName === "BUTTON") {
				let currentNode = SelectionManager.getCurrentNode()
				if (currentNode instanceof PVMImageNode) {
					currentNode.setKind("float-left")
				}
			} else if (target.nodeName === "FIGCAPTION") {
				// target.parentElement.classList.add("caption-focused")
				// target.parentElement.classList.remove("node-selected")
				// PopTool.hideImageTool()
				// if (!target.parentElement.classList.contains("caption-enabled")) {
				// 	target.innerHTML = "<br>"
				// }
			} else if (
				target.nodeName === "INPUT" &&
				target.parentElement.classList.contains("pack")
			) {
				// console.log("clicked poptool input")
			} else {

			}

			this.onSelectionChanged()
		})

		// disable images contenteditable false
		// var imgs = document.getElementsByTagName("figure")
		// for (var i = 0 i < imgs.length ++i) {
		// 			imgs[i].contentEditable = false
		// }
	}

	public static onPaste(e: ClipboardEvent) {
		// e.preventDefault()
		// console.log(e.clipboardData.getData("text/plain"))

		let pasteArea = EditSession.editorDOM.querySelector("#paste-area")
		pasteArea.innerHTML = ""
		
		let currentRange = EditSession.currentState.range

		if (!currentRange.collapsed) {
			SelectionManager.removeSelection()
		}

		let range = document.createRange()
		range.setStart(pasteArea, 0)
		range.collapse(true)

		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)

		setTimeout(() => {
			
		}, 4)
	}

	/**
	 * @param {KeyboardEvent} e
	 */
	public static onKeyDown(e: KeyboardEvent) {
		let currentRange = SelectionManager.getCurrentRange()
		if (!currentRange) return
		let currentNode = currentRange.start.node

		// console.log("keydown")
		let keyCode = e.keyCode
		let physKeyCode = e.code
		// Prevent Hangul compositionEnd + spacebar
		if (physKeyCode === "Space" && e.key === "Process") return

		// Select all (command + a or control + a)
		if (physKeyCode === "KeyA" && (e.metaKey || e.ctrlKey)) {
			let pvmRange = new PVMRange({
				startNode: EditSession.nodeList[0],
				startOffset: 0,
				endNode: EditSession.nodeList[EditSession.nodeList.length - 1],
				endOffset: EditSession.nodeList[EditSession.nodeList.length - 1].getTextContent().length
			})
			SelectionManager.setRange(pvmRange)
			console.log("selected all")
			console.log(pvmRange)
			e.preventDefault()
			return
		}

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

			// console.log(currentRange)

			if (
				currentRange &&
				currentRange.collapsed &&
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
					latestAction
					&& !Array.isArray(latestAction)
					&& latestAction.type === "textChange"
					&& latestAction.key === key
					&& latestAction.targetNode.isSameAs(currentNode)
					// && physKeyCode !== "Space"
				) {
					latestAction.nextHTML = modifiedContents
					latestAction.nextRange = newRange
					console.group("continue record")
					console.log(modifiedContents)
					// console.log(newRange)
					console.groupEnd()
				} else {
					console.group("new record")
					console.log(originalContents)
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
				currentNode.getTextContent().match(/^1\. /)) ||
				currentNode.getTextContent().match(/^```/)
		) {
			let type = "li"
			let kind = "ul"
			if (currentNode.getTextContent().match(/^1\. /)) {
				kind = "ol"
			} else if (currentNode.getTextContent().match(/^```/)) {
				type = "code"
				kind = undefined
			}

			let originalType = currentNode.type
			let originalParentType = currentNode.kind
			NodeManager.transformNode(currentNode, type, kind)
			currentNode.fixEmptiness()
			let newRange = new PVMRange({
				startNode: currentNode,
				startOffset: 0,
				endNode: currentNode,
				endOffset: 0
			})
			SelectionManager.setRange(newRange)
			UndoManager.record({
				type: "transform",
				targetNode: currentNode,
				previousType: originalType,
				previousParentType: originalParentType,
				nextType: type,
				nextParentType: kind,
				previousRange: newRange,
				nextRange: newRange
			})
		}
	}

	public static onPressEnter(e: KeyboardEvent, finalAction: boolean = false) {
		e.preventDefault()

		let currentRange = SelectionManager.getCurrentRange()
		let currentNode = SelectionManager.getCurrentNode()

		if (currentRange && currentRange.collapsed) {
			// Selection is collapsed

			let state = currentRange.start.state

			if (state === 1) {
				let newNode: PVMNode
				if (TypeChecker.isListItem(currentNode.type)) {
					newNode = NodeManager.createNode("li", {
						kind: currentNode.kind
					})
				} else {
					newNode = NodeManager.createNode(currentNode.type)
				}
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
				let newRange = new PVMRange({
					startNode: newNode,
					startOffset: 0,
					endNode: newNode,
					endOffset: 0
				})
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
						newNode = NodeManager.createNode("li", {
							kind: currentNode.kind
						})
					} else if (state === 4) {
						let originalType = currentNode.type
						let originalParentType = currentNode.kind
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
						let originalParentType = currentNode.kind
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
				let newRange = new PVMRange({
					startNode: newNode,
					startOffset: 0,
					endNode: newNode,
					endOffset: 0
				})
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
					let originalParentType = currentNode.kind
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
						let newRange = new PVMRange({
							startNode: prvs,
							startOffset: prvsOrgLen,
							endNode: prvs,
							endOffset: prvsOrgLen
						})
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
					let originalParentType = currentNode.kind
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
					let newRange = new PVMRange({
						startNode: prvs,
						startOffset: prvs.textElement.textContent.length,
						endNode: prvs,
						endOffset: prvs.textElement.textContent.length
					})
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
					let newRange = new PVMRange({
						startNode: nextNode,
						startOffset: 0,
						endNode: nextNode,
						endOffset: 0
					})
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
		// Smooth Cursor Implementation
		// let jsRange: Range
		// if (window.getSelection().rangeCount > 0) {
		// 	jsRange = window.getSelection().getRangeAt(0)
		// 	let left = jsRange.getClientRects()[0].left
		// 	let top = jsRange.getClientRects()[0].top
		// 	let caret = <HTMLElement> document.querySelector("#caret")
		// 	caret.style.left = left + "px"
		// 	caret.style.top = top + "px"
		// 	caret.classList.add("stay")
		// }

		console.log("Selection has been changed")

		let currentRange = SelectionManager.getCurrentRange()
		if (!currentRange || !currentRange.start.node) return
		let currentNode = currentRange.start.node

		// Update current state 
		EditSession.currentState.node = currentNode
		EditSession.currentState.range = currentRange
		if (currentNode && currentNode.textElement) {
			EditSession.currentState.textHTML = currentNode.textElement.innerHTML
		}

		let selectionChangeEvent = new CustomEvent(
			"selectionChanged",
			{
				detail: {
					currentRange: currentRange
				},
				bubbles: false,
				cancelable: false
			}
		)
		document.dispatchEvent(selectionChangeEvent)
	}
}
