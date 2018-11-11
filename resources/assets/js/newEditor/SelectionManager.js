import UndoManager from "./UndoManager"
import EventManager from "./EventManager"
import NodeManager from "./NodeManager"
import EditSession from "./EditSession"
import PVMRange from "./PVMRange"
import PVMNode from "./PVMNode"
import AT from "./config/AvailableTypes"

export default class SelectionManager {

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
		 * @type {EventManager}
		 */
		this.eventMan = null
		/**
		 * @type {EditSession}
		 */
		this.editSession = null

	}

	// Setters

	/**
	 *
	 * @param {PVMNodeManager} nodeMan
	 */
	setNodeManager(nodeMan)
	{
		this.nodeMan = nodeMan
	}

	/**
	 * Sets the PVMRange in the editor.
	 * @param {PVMRange} pvmRange
	 */
	setRange(pvmRange) {

		let range = document.createRange() // JS Range
		let rangeStartContainer, rangeStartOffset, rangeEndContainer, rangeEndOffset
		let startNodePVMN = pvmRange.start.node
		let startNodeDOM = startNodePVMN.textElement
		let startNodeOffset = pvmRange.start.offset

		// Calculate start
		let travelNode = startNodeDOM.firstChild
		let length = 0
		let loopDone = false

		rangeStartContainer = startNodeDOM
		rangeStartOffset = 0

		// if (startNodeOffset === -1) {
		// 	startNodeOffset = startNodeDOM.textContent.length
		// }

		while (1) {

			if (!travelNode) {
				break
			}

			if (travelNode.nodeType === 3) {

				if (length + travelNode.textContent.length >= startNodeOffset) {

					rangeStartContainer = travelNode
					rangeStartOffset = startNodeOffset - length
					break

				} else {

					length += travelNode.textContent.length

				}

			}

			if (travelNode.firstChild) {

				travelNode = travelNode.firstChild

			} else if (travelNode.nextSibling) {

				travelNode = travelNode.nextSibling

			} else {

				travelNode = travelNode.parentNode

				while (1) {

					if (travelNode.isEqualNode(startNodeDOM)) {
						loopDone = true
						break
					} else if (travelNode.nextSibling) {
						travelNode = travelNode.nextSibling
						break
					} else {
						travelNode = travelNode.parentNode
					}

				}

			}

			if (loopDone) {
				break
			}

		}

		range.setStart(rangeStartContainer, rangeStartOffset)

		let endNodePVMN = pvmRange.end.node
		let endNodeDOM = endNodePVMN.textElement
		let endNodeOffset = pvmRange.end.offset

		// Calculate end
		travelNode = endNodeDOM.firstChild
		length = 0
		loopDone = false

		rangeEndContainer = endNodeDOM
		rangeEndOffset = 0

		if (endNodeOffset === -1) {
			endNodeOffset = node.textContent.length
		}

		while (1) {

			if (travelNode.nodeType === 3) {

				if (length + travelNode.textContent.length >= endNodeOffset) {

					rangeEndContainer = travelNode
					rangeEndOffset = endNodeOffset - length
					break

				} else {

					length += travelNode.textContent.length

				}

			}

			if (travelNode.firstChild) {

				travelNode = travelNode.firstChild

			} else if (travelNode.nextSibling) {

				travelNode = travelNode.nextSibling

			} else {

				travelNode = travelNode.parentNode

				while (1) {

					if (travelNode.isEqualNode(endNodeDOM)) {
						loopDone = true
						break
					} else if (travelNode.nextSibling) {
						travelNode = travelNode.nextSibling
						break
					} else {
						travelNode = travelNode.parentNode
					}

				}

			}

			if (loopDone) {
				break
			}

		}

		range.setEnd(rangeEndContainer, rangeEndOffset)

		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)

		this.eventMan.onSelectionChanged()

	}

	getCurrentRange() {

		if (document.getSelection().rangeCount === 0) {
			return null
		}

		let range = document.getSelection().getRangeAt(0)
		let closestTarget

		let startNode, endNode
		let startOffset = 0, endOffset = 0

		for (let i = 0; i < AT.topTags.length; i++) {

			if (range.startContainer.closest) {
				closestTarget = range.startContainer
			} else {
				closestTarget = range.startContainer.parentElement
			}

			if (closestTarget.closest(AT.topTags[i])) {
				let startElm = closestTarget.closest(AT.topTags[i])
				startNode = this.nodeMan.getNodeByID(this.nodeMan.getNodeID(startElm))
				let n, walk = document.createTreeWalker(startElm, NodeFilter.SHOW_TEXT, null, false)
				while (n = walk.nextNode()) {
					if (n.isSameNode(range.startContainer)) {
						startOffset += range.startOffset
						break
					}
					startOffset += n.textContent.length
				}
				break
			}

		}

		if (range.collapsed) {
			endNode = startNode, endOffset = startOffset
		} else {

			for (let i = 0; i < AT.topTags.length; i++) {

				if (range.endContainer.closest) {
					closestTarget = range.endContainer
				} else {
					closestTarget = range.endContainer.parentElement
				}
	
				if (closestTarget.closest(AT.topTags[i])) {
					let endElm = closestTarget.closest(AT.topTags[i])
					endNode = this.nodeMan.getNodeByID(this.nodeMan.getNodeID(endElm))
					let n, walk = document.createTreeWalker(endElm, NodeFilter.SHOW_TEXT, null, false)
					while (n = walk.nextNode()) {
						if (n.isSameNode(range.endContainer)) {
							endOffset += range.endOffset
							break
						}
						endOffset += n.textContent.length
					}
					break
				}
	
			}

			if (range.endContainer.nodeType !== 3) {
				endOffset = range.endOffset
			}

		}

		return new PVMRange(startNode, startOffset, endNode, endOffset)

	}

	/**
	 * Returns current pvmNode where the cursor is.
	 * @return {PVMNode}
	 */
	getCurrentNode() {

		let sel = window.getSelection()
		if (sel.rangeCount === 0) return null

		let range = sel.getRangeAt(0)
		let startNode = range.startContainer

		/**
		 * @type {Element}
		 */
		let node = null

		for (let i = 0; i < AT.topTags.length; i++) {

			if (startNode.closest) {
				node = startNode.closest(AT.topTags[i])
			} else {
				node = startNode.parentElement.closest(AT.topTags[i])
			}

			if (node) break

		}

		if (!node) {
			return null
		}

		let nodeID = Number(node.getAttribute("data-ni"))

		let pvmNode = this.nodeMan.getNodeByID(nodeID)

		return pvmNode

	}

	/**
	 * @param {string} type "textContained" | "p" | "h1" | ...
	 * @return {Array.<PVMNode>}
	 */
	getAllNodesInSelection(type) {

		let currentRange = this.getCurrentRange()
		let startNode = currentRange.start.node
		let endNode = currentRange.end.node

		let nodes = []

		let travelNode = startNode
		let nextNode

		while (1) {

			if (type) {
				if (type === "textContained") {
					if (AT.textContained.includes(travelNode.type)) {
						nodes.push(travelNode)
					}
				} else {
					if (type === travelNode.type) {
						nodes.push(travelNode)
					}
				}
			} else {
				nodes.push(travelNode)
			}
			

			if (travelNode.isSameAs(endNode)) break

			nextNode = travelNode.nextSibling

			if (!nextNode) break

			travelNode = nextNode

		}

		return nodes


	}

	getAllNodesInEditor() {
		let travelNode = this.nodeMan.getFirstChild()
		let allNodes = []
		allNodes.push(travelNode)
		while (travelNode = travelNode.getNextSibling()) {
			allNodes.push(travelNode)
		}

		return allNodes
	}

	/**
	 * Returns current cursor state.
	 * 1. |hello, 2. he|llo, 3. hello|
	 */
	getCursorState() {

	}

	/**
	 *
	 * @param {Node} node
	 * @param {Node} container
	 * @param {number} rangeOffset
	 * @return {number}
	 */
	getTextOffset(node, container, rangeOffset) {

		if (!node) {
			console.log("The given node is null")
			return
		}

		let travelNode = node.firstChild
		let length = 0
		let loopDone = false

		while (1) {

			if (travelNode.nodeType === 3) {

				if (travelNode.isEqualNode(container)) {

					length += rangeOffset
					break

				} else {

					length += travelNode.textContent.length

				}

			}

			if (travelNode.firstChild) {

				travelNode = travelNode.firstChild

			} else if (travelNode.nextSibling) {

				travelNode = travelNode.nextSibling

			} else {

				travelNode = travelNode.parentNode

				while (1) {

					if (travelNode.isEqualNode(node)) {
						loopDone = true
						break
					} else if (travelNode.nextSibling) {
						travelNode = travelNode.nextSibling
						break
					} else {
						travelNode = travelNode.parentNode
					}

				}

			}

			if (loopDone) {
				break
			}

		}

		return length
	}

	// Actions

	/**
	 *
	 * @param {PVMNode} startNode
	 * @param {number} startOffset
	 * @param {PVMNode} endNode
	 * @param {number} endOffset
	 */
	createRange(startNode, startOffset, endNode, endOffset) {

		let range = new PVMRange(startNode, startOffset, endNode, endOffset)
		return range
	}

	/**
	 *
	 * @param {PVMNode} node
	 * @param {number} offset
	 */
	focusAt(node, offset) {

	}

	removeSelection(withKey = "backspace") {
		let jsSel = window.getSelection()
		let jsRange = window.getSelection().getRangeAt(0)
		let pvmRange = this.getCurrentRange()
		let nodes = this.getAllNodesInSelection()

		let extraBackspace = true, extraEnter = false
		
		// console.log(pvmRange)
		// console.log(jsRange)

		let actions = []

		for (let i = 0; i < nodes.length; i++) {
			if (
				nodes[i].element.contains(jsRange.startContainer) &&
				nodes[i].element.contains(jsRange.endContainer)
			) {
				extraBackspace = false
				extraEnter = true
				let originalContents = nodes[i].textElement.innerHTML
				jsRange.deleteContents()
				if (!nodes[i].element.querySelector("br")) {
					nodes[i].element.appendChild(document.createElement("br"))
				}
				let newRange = pvmRange.clone()
				newRange.setEnd(pvmRange.start.node, pvmRange.start.offset)
				this.setRange(newRange)
				actions.push({
					type: "textChange",
					targetNode: nodes[i],
					previousHTML: originalContents,
					nextHTML: nodes[i].textElement.innerHTML,
					previousRange: pvmRange,
					nextRange: newRange
				})
			} else if (
				nodes[i].element.contains(jsRange.startContainer) &&
				!nodes[i].element.contains(jsRange.endContainer)
			) {
				if (!nodes[i].element.querySelector("br")) {
					nodes[i].element.appendChild(document.createElement("br"))
				}
				let newRange = pvmRange.clone()
				let originalContents = nodes[i].textElement.innerHTML
				newRange.setEnd(nodes[i], nodes[i].textElement.textContent.length)
				this.setRange(newRange)
				window.getSelection().getRangeAt(0).deleteContents()
				newRange.setStart(nodes[i], nodes[i].getTextContent().length)
				newRange.setEnd(nodes[i], nodes[i].getTextContent().length)
				this.setRange(newRange)
				actions.push({
					type: "textChange",
					targetNode: nodes[i],
					previousHTML: originalContents,
					nextHTML: nodes[i].textElement.innerHTML,
					previousRange: pvmRange,
					nextRange: newRange
				})
			} else if (
				!nodes[i].element.contains(jsRange.startContainer) &&
				nodes[i].element.contains(jsRange.endContainer)
			) {
				if (!nodes[i].element.querySelector("br")) {
					nodes[i].element.appendChild(document.createElement("br"))
				}
				let newRange = pvmRange.clone()
				let originalContents = nodes[i].textElement.innerHTML
				newRange.setStart(nodes[i], 0)
				this.setRange(newRange)
				window.getSelection().getRangeAt(0).deleteContents()
				newRange.setStart(nodes[i], 0)
				newRange.setEnd(nodes[i], 0)
				this.setRange(newRange)
				actions.push({
					type: "textChange",
					targetNode: nodes[i],
					previousHTML: originalContents,
					nextHTML: nodes[i].textElement.innerHTML,
					previousRange: pvmRange,
					nextRange: newRange
				})
			} else if (
				!nodes[i].element.contains(jsRange.startContainer) &&
				!nodes[i].element.contains(jsRange.endContainer)
			) {
				let nextNode = nodes[i].nextSibling
				this.nodeMan.removeChild(nodes[i])
				actions.push({
					type: "remove",
					targetNode: nodes[i],
					nextNode: nextNode,
					previousRange: pvmRange,
					nextRange: pvmRange
				})
			}
		}

		this.undoMan.record(actions)

		if (extraBackspace && withKey === "backspace") {
			console.log("backsapce")
			let ke = document.createEvent("KeyboardEvent")
			this.eventMan.onPressBackspace(ke, true)
			// setTimeout(() => {
			// 	let ke = document.createEvent("KeyboardEvent")
			// 	this.eventMan.onPressBackspace(ke, true)
			// }, 0)
		} else if (extraEnter && withKey === "enter") {
			let ke = document.createEvent("KeyboardEvent")
			this.eventMan.onPressEnter(ke, true)
			// setTimeout(() => {
			// 	let ke = document.createEvent("KeyboardEvent")
			// 	this.eventMan.onPressEnter(ke, true)
			// }, 0)
		}

	}

}
