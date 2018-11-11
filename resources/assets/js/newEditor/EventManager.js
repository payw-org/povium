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

		let eventNames

		eventNames = ["mousedown", "touchstart"]
		eventNames.forEach((eventName) => {
			window.addEventListener(eventName, e => {
				if (!e.target.closest("#poptool")) {
					this.popTool.hidePopTool()
					this.mouseDownStart = true
				}
			})
		})

		eventNames = ["mouseup", "touchend"]
		eventNames.forEach((eventName) => {
			this.editSession.editorBody.addEventListener(eventName, (e) => {
				this.onSelectionChanged()
			})
		})

		eventNames = ["mouseup", "touchend"]
		eventNames.forEach(eventName => {
			window.addEventListener(eventName, (e) => {
				if (this.mouseDownStart && !e.target.closest("#editor-body")) {
					this.mouseDownStart = false
					this.onSelectionChanged()
				}
			})
		})

		this.editSession.editorBody.addEventListener('dragstart', (e) => {
			e.preventDefault()
		})
		this.editSession.editorBody.addEventListener('drop', (e) => {
			e.preventDefault()
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

		this.editSession.editorBody.addEventListener("input", (e) => {
			this.onInput(e)
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
			}, 0)
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

			// let originalCurrentNode = this.postEditor.selManager.getNodeInSelection()
			let originalCurrentNode = this.selMan.getno
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


	/**
	 * @param {KyboardEvent} e
	 */
	onKeyPress(e) {

	}

	/**
	*
	* @param {KeyboardEvent} e
	*/
	onKeyDown(e) {

		// console.log("keydown")

		let keyCode = e.keyCode
		let physKeyCode = e.code

		let currentRange = this.selMan.getCurrentRange()
		let currentNode = this.selMan.getCurrentNode()
		if (!currentNode) return

		// This flag determines the availability of
		// changing text.
		let enableTextChangeRecord = false

		let key = "char"
		// When press a key where it puts any space inside the editor,
		// this variable is true.
		let validCharKey =
			((keyCode > 47 && keyCode < 58) || // number keys
				keyCode === 32 || // spacebar & return key(s) (if you want to allow carriage returns)
				(keyCode > 64 && keyCode < 91) || // letter keys
				(keyCode > 95 && keyCode < 112) || // numpad keys
				(keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
				(keyCode > 218 && keyCode < 223) || // [\]' (in order)
				keyCode === 229)
			&& !e.ctrlKey && !e.metaKey

		// Backspace key (delete on macOS)
		if (keyCode === 8) {

			setTimeout(() => {
				this.nodeMan.normalize(currentNode.textElement)
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
				this.onPressBackspace(e)
			}

		} else if (keyCode === 46) { // Delete key (fn + delete on macOS)

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

		} else if (keyCode === 13) { // Enter key (return on macOS)

			// Enter(Return)
			e.preventDefault()
			this.onPressEnter(e)

		} else if (keyCode === 90 && e.ctrlKey) { // cmd + z (deprecated)

			// e.preventDefault()
			// this.ssManager.undo()

		}

		if (validCharKey || enableTextChangeRecord) {

			if (window.getSelection().rangeCount > 0 && !window.getSelection().getRangeAt(0).collapsed) {
				this.selMan.removeSelection("backspace")
			}

			this.charKeyDownLocked = true

			let originalContents = this.editSession.currentState.textHTML
			let originalRange = this.editSession.currentState.range
			let modifiedContents, newRange
			setTimeout(() => {
				modifiedContents = currentNode.textElement.innerHTML
				newRange = this.selMan.getCurrentRange()
	
				let latestAction = this.undoMan.getLatestAction()
				if (
					latestAction &&
					latestAction.type === "textChange" &&
					latestAction.key === key &&
					(keyCode !== 32 && physKeyCode !== "Space")
				) {
					latestAction.nextHTML = modifiedContents
					latestAction.nextRange = newRange
				} else {
					this.undoMan.record({
						type: "textChange",
						previousHTML: originalContents,
						nextHTML: modifiedContents,
						targetNode: currentNode,
						previousRange: originalRange,
						nextRange: newRange,
						key: key
					})
				}
			}, 1)

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
		}, 1)




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

		let keyCode = e.keyCode
		let physKeyCode = e.code

		let currentRange = this.selMan.getCurrentRange()

		if (!currentRange) return
		let currentNode = this.selMan.getCurrentNode()
		if (!currentNode) {
			return
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
			keyCode === 32 &&
			AT.isParagraph(currentNode.type) &&
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
			this.nodeMan.transformNode(currentNode, "li", parentType)
			currentNode.fixEmptiness()
			let newRange = this.selMan.createRange(currentNode, 0, currentNode, 0)
			this.selMan.setRange(newRange)
			this.undoMan.record({
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

	/**
	 * @param {KeyboardEvent} e
	 */
	onPressEnter(e, finalAction = false) {

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
				this.undoMan.record({
					type: "insert",
					targetNode: newNode,
					nextNode: currentNode,
					previousRange: currentRange,
					nextRange: currentRange,
					finalAction: finalAction
				})

			} else if (state === 2) {

				let newNode = this.nodeMan.splitNode()
				let newRange = this.selMan.createRange(newNode, 0, newNode, 0)
				this.selMan.setRange(newRange)
				this.undoMan.record({
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
						newNode = this.nodeMan.createNode("LI", {
							parentType: currentNode.parentType
						})
					} else if (state === 4) {
						let originalType = currentNode.type
						let originalParentType = currentNode.parentType
						this.nodeMan.transformNode(currentNode, "p")
						this.selMan.setRange(currentRange)
						this.undoMan.record({
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
						this.nodeMan.transformNode(currentNode, "p")
						this.selMan.setRange(currentRange)
						return
					} else {
						newNode = this.nodeMan.createNode("p")
					}
				} else {
					newNode = this.nodeMan.createNode("p")
				}
				let nextNode = currentNode.nextSibling
				this.nodeMan.insertChildBefore(newNode, nextNode)
				let newRange = this.selMan.createRange(newNode, 0, newNode, 0)
				this.selMan.setRange(newRange)
				this.undoMan.record({
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

			this.selMan.removeSelection("enter")

		}

	}

	/**
	 * @param {KeyboardEvent} e
	 */
	onPressBackspace(e, finalAction = false) {

		let currentRange = this.selMan.getCurrentRange()
		let currentNode = this.selMan.getCurrentNode()

		let isCollapsed = currentRange.isCollapsed()

		if (isCollapsed) {

			let state = currentRange.start.state

			if (state === 1 || state === 4) {
				e.preventDefault()
				if (!AT.mergeable.includes(currentNode.type)) {
					return
				}
			}

			if (state === 1) {

				if (currentNode.type === "li") {
					this.nodeMan.transformNode(currentNode, "p")
					this.selMan.setRange(currentRange)
					return
				}

				let prvs = currentNode.previousSibling

				if (!AT.mergeable.includes(prvs.type)) {

					this.nodeMan.removeChild(prvs)
					this.undoMan.record({
						type: "remove",
						targetNode: prvs,
						nextNode: currentNode,
						previousRange: currentRange,
						nextRange: currentRange,
						finalAction: finalAction
					})

				} else {

					if (prvs && prvs.getTextContent() === "") {
						this.nodeMan.removeChild(prvs)
						this.undoMan.record({
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
						this.nodeMan.mergeNodes(prvs, currentNode)
						let newRange = this.selMan.createRange(prvs, prvsOrgLen, prvs, prvsOrgLen)
						this.selMan.setRange(newRange)
						this.undoMan.record({
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
					this.nodeMan.transformNode(currentNode, "p")
					this.selMan.setRange(currentRange)
					return
				}

				let prvs = currentNode.previousSibling

				if (prvs) {

					let nextNode = currentNode.nextSibling
					this.nodeMan.removeChild(currentNode)
					let newRange = this.selMan.createRange(prvs, prvs.textElement.textContent.length, prvs, prvs.textElement.textContent.length)
					this.selMan.setRange(newRange)
					this.undoMan.record({
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
			this.selMan.removeSelection()
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
				if (!AT.mergeable.includes(currentNode.type)) {
					return
				}
			}

			if (state === 3) {

				let next = currentNode.nextSibling
				let nextNext = next.nextSibling

				if (!AT.mergeable.includes(next.type)) {

					this.nodeMan.removeChild(next)
					this.undoMan.record({
						type: "remove",
						targetNode: next,
						nextNode: nextNext,
						previousRange: currentRange,
						nextRange: currentRange
					})

				} else {

					if (next && next.getTextContent() === "") {
						this.nodeMan.removeChild(next)
						this.undoMan.record({
							type: "remove",
							targetNode: next,
							nextNode: nextNext,
							previousRange: currentRange,
							nextRange: currentRange
						})
					} else if (next) {
	
						let nextOrgLen = next.textElement.textContent.length
						let originalContents = currentNode.textElement.innerHTML
						this.nodeMan.mergeNodes(currentNode, next)
						this.selMan.setRange(currentRange)
						this.undoMan.record({
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
					this.nodeMan.removeChild(currentNode)
					let newRange = this.selMan.createRange(nextNode, 0, nextNode, 0)
					this.selMan.setRange(newRange)
					this.undoMan.record({
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
			this.selMan.removeSelection()
		}

	}

	onSelectionChanged() {

		if (window.getSelection().rangeCount === 0) {
			return
		}

		// Fix selection
		let jsRange = window.getSelection().getRangeAt(0)
		let newStartContainer, newEndContainer, newStartOffset, newEndOffset
		let needsFix = false

		// console.log(pvmRange)
		// console.log(pvmRange.isCollapsed())

		// set new start
		if (jsRange.startContainer.nodeType !== 3 && jsRange.startContainer.childNodes.length > 0) {

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
		if (jsRange.endContainer.nodeType !== 3 && jsRange.endContainer.childNodes.length > 0) {

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

			if (newEndContainer.nodeName === "BR") {
				jsRange.setEndBefore(newEndContainer)
			} else {
				jsRange.setEnd(newEndContainer, newEndOffset)
			}

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
		// 	this.selMan.setRange(pvmRange)
		// }

		let currentRange = this.selMan.getCurrentRange()
		let currentNode = this.selMan.getCurrentNode()
		if (currentNode) {
			this.editSession.currentState.nodeID = currentNode.id
			this.editSession.currentState.innerHTML = currentNode.textElement.innerHTML
			this.editSession.currentState.range = currentRange
		}

		this.popTool.togglePopTool()

		this.editSession.currentState.node = currentNode
		this.editSession.currentState.range = currentRange
		if (currentNode && currentNode.textElement) {
			this.editSession.currentState.textHTML = currentNode.textElement.innerHTML
		}

	}


}
