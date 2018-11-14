import UndoManager from "./UndoManager"
import EventManager from "./EventManager"
import NodeManager from "./NodeManager"
import EditSession from "./EditSession"
import PVMRange from "./PVMRange"
import PVMNode from "./PVMNode"
import {AT} from "./config/AvailableTypes"

export default class SelectionManager {

	constructor() {

	}

	// Setters

	public static setRange(pvmRange: PVMRange) {

		if (!pvmRange) return

		let range = document.createRange()  // JS Range
		let rangeStartContainer, rangeStartOffset, rangeEndContainer, rangeEndOffset
		let startNodePVMN   = pvmRange.start.node
		let startNodeDOM    = startNodePVMN.textElement
		let startNodeOffset = pvmRange.start.offset

		// Calculate start
		let travelNode: Node = startNodeDOM.firstChild
		let length           = 0
		let loopDone         = false

		rangeStartContainer = startNodeDOM
		rangeStartOffset    = 0

		// if (startNodeOffset === -1) {
		// 	startNodeOffset = startNodeDOM.textContent.length
		// }

		while (1) {

			if (!travelNode) break

			if (travelNode.nodeType === 3) {

				if (length + travelNode.textContent.length >= startNodeOffset) {

					rangeStartContainer = travelNode
					rangeStartOffset    = startNodeOffset - length
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

		let endNodePVMN   = pvmRange.end.node
		let endNodeDOM    = endNodePVMN.textElement
		let endNodeOffset = pvmRange.end.offset

		// Calculate end
		travelNode = endNodeDOM.firstChild
		length     = 0
		loopDone   = false

		rangeEndContainer = endNodeDOM
		rangeEndOffset    = 0

		// if (endNodeOffset === -1) {
		// 	endNodeOffset = endNodeDOM.textContent.length
		// }

		while (1) {

			if (!travelNode) break

			if (travelNode.nodeType === 3) {

				if (length + travelNode.textContent.length >= endNodeOffset) {

					rangeEndContainer = travelNode
					rangeEndOffset    = endNodeOffset - length
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

		EventManager.onSelectionChanged()

	}

	public static getCurrentRange() {

		if (document.getSelection().rangeCount === 0) {
			return null
		}

		let range = document.getSelection().getRangeAt(0)
		let closestTarget: Element

		let startNode, endNode
		let startOffset = 0, endOffset = 0

		for (let i = 0; i < AT.topTags.length; i++) {

			if (range.startContainer.nodeType !== 3) {
				closestTarget = <Element>(range.startContainer)
			} else {
				closestTarget = range.startContainer.parentElement
			}

			if (closestTarget.closest(AT.topTags[i])) {
				let startElm = closestTarget.closest(AT.topTags[i])
				startNode = NodeManager.getNodeByID(NodeManager.getNodeID(startElm))
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

				if (range.endContainer.nodeType !== 3) {
					closestTarget = <Element>(range.endContainer)
				} else {
					closestTarget = range.endContainer.parentElement
				}
	
				if (closestTarget.closest(AT.topTags[i])) {
					let endElm  = closestTarget.closest(AT.topTags[i])
					endNode = NodeManager.getNodeByID(NodeManager.getNodeID(endElm))
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

	public static getCurrentNode(): PVMNode {

		let sel = window.getSelection()
		if (sel.rangeCount === 0) return null

		let range     = sel.getRangeAt(0)
		let startNode = range.startContainer

		let node: Element = null

		for (let i = 0; i < AT.topTags.length; i++) {

			if (startNode.nodeType === 3) {
				node = startNode.parentElement.closest(AT.topTags[i])
			} else {
				node = (<Element>startNode).closest(AT.topTags[i])
			}

			if (node) break

		}

		if (!node) {
			return null
		}

		let nodeID = Number(node.getAttribute("data-ni"))

		let pvmNode = NodeManager.getNodeByID(nodeID)

		return pvmNode

	}


	public static getAllNodesInSelection(type?: string): PVMNode[] {

		let currentRange = this.getCurrentRange()
		let startNode    = currentRange.start.node
		let endNode      = currentRange.end.node

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

	public static getAllNodesInEditor() {
		let travelNode = NodeManager.getFirstChild()
		let allNodes   = []
		allNodes.push(travelNode)
		while (travelNode = travelNode.nextSibling) {
			allNodes.push(travelNode)
		}

		return allNodes
	}

	/**
	 * Returns current cursor state.
	 * 1. |hello, 2. he|llo, 3. hello|
	 */
	public static getCursorState() {

	}

	public static getTextOffset(node: Node, container: Node, rangeOffset: number): number
	{

		let travelNode: Node    = node.firstChild
		let length    : number  = 0
		let loopDone  : boolean = false

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


	public static createRange(startNode: PVMNode, startOffset: number, endNode: PVMNode, endOffset: number)
	{
		let range = new PVMRange(startNode, startOffset, endNode, endOffset)
		return range
	}


	public static focusAt(node: PVMNode, offset: number)
	{

	}

	/**
	 * Remove uncollapsed selection.
	 */
	public static removeSelection(withKey: string = "backspace")
	{
		let jsSel    = window.getSelection()
		let jsRange  = window.getSelection().getRangeAt(0)
		let pvmRange = this.getCurrentRange()
		let nodes    = this.getAllNodesInSelection()

		let extraBackspace = true, extraEnter = false
		
		// console.log(pvmRange)
		// console.log(jsRange)

		let actions = []

		for (let i = 0; i < nodes.length; i++) {
			if (
				nodes[i].element.contains(jsRange.startContainer) &&
				nodes[i].element.contains(jsRange.endContainer)
			) {
				                extraBackspace   = false
				                extraEnter       = true
				            let originalContents = nodes[i].textElement.innerHTML
				jsRange.deleteContents()
				if (!nodes[i].element.querySelector("br")) {
					nodes[i].element.appendChild(document.createElement("br"))
				}
				let newRange = pvmRange.clone()
				newRange.setEnd(pvmRange.start.node, pvmRange.start.offset)
				this.setRange(newRange)
				actions.push({
					type         : "textChange",
					targetNode   : nodes[i],
					previousHTML : originalContents,
					nextHTML     : nodes[i].textElement.innerHTML,
					previousRange: pvmRange,
					nextRange    : newRange
				})
			} else if (
				nodes[i].element.contains(jsRange.startContainer) &&
				!nodes[i].element.contains(jsRange.endContainer)
			) {
				if (!nodes[i].element.querySelector("br")) {
					nodes[i].element.appendChild(document.createElement("br"))
				}
				let newRange         = pvmRange.clone()
				let originalContents = nodes[i].textElement.innerHTML
				newRange.setEnd(nodes[i], nodes[i].textElement.textContent.length)
				this.setRange(newRange)
				window.getSelection().getRangeAt(0).deleteContents()
				newRange.setStart(nodes[i], nodes[i].getTextContent().length)
				newRange.setEnd(nodes[i], nodes[i].getTextContent().length)
				this.setRange(newRange)
				actions.push({
					type         : "textChange",
					targetNode   : nodes[i],
					previousHTML : originalContents,
					nextHTML     : nodes[i].textElement.innerHTML,
					previousRange: pvmRange,
					nextRange    : newRange
				})
			} else if (
				!nodes[i].element.contains(jsRange.startContainer) &&
				nodes[i].element.contains(jsRange.endContainer)
			) {
				if (!nodes[i].element.querySelector("br")) {
					nodes[i].element.appendChild(document.createElement("br"))
				}
				let newRange         = pvmRange.clone()
				let originalContents = nodes[i].textElement.innerHTML
				newRange.setStart(nodes[i], 0)
				this.setRange(newRange)
				window.getSelection().getRangeAt(0).deleteContents()
				newRange.setStart(nodes[i], 0)
				newRange.setEnd(nodes[i], 0)
				this.setRange(newRange)
				actions.push({
					type         : "textChange",
					targetNode   : nodes[i],
					previousHTML : originalContents,
					nextHTML     : nodes[i].textElement.innerHTML,
					previousRange: pvmRange,
					nextRange    : newRange
				})
			} else if (
				!nodes[i].element.contains(jsRange.startContainer) &&
				!nodes[i].element.contains(jsRange.endContainer)
			) {
				let nextNode = nodes[i].nextSibling
				NodeManager.removeChild(nodes[i])
				actions.push({
					type         : "remove",
					targetNode   : nodes[i],
					nextNode     : nextNode,
					previousRange: pvmRange,
					nextRange    : pvmRange
				})
			}
		}

		UndoManager.record(actions)

		if (extraBackspace && withKey === "backspace") {
			console.log("backsapce")
			let ke = document.createEvent("KeyboardEvent")
			EventManager.onPressBackspace(ke, true)
			// setTimeout(() => {
			// 	let ke = document.createEvent("KeyboardEvent")
			// 	EventManager.onPressBackspace(ke, true)
			// }, 0)
		} else if (extraEnter && withKey === "enter") {
			let ke = document.createEvent("KeyboardEvent")
			EventManager.onPressEnter(ke, true)
			// setTimeout(() => {
			// 	let ke = document.createEvent("KeyboardEvent")
			// 	EventManager.onPressEnter(ke, true)
			// }, 0)
		}

	}

}
