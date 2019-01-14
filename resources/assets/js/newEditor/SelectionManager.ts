import { AT } from "./AvailableTypes"
import EventManager from "./EventManager"
import NodeManager from "./NodeManager"
import PVMNode from "./PVMNode"
import PVMRange from "./PVMRange"
import UndoManager from "./UndoManager"
import EditSession from "./EditSession"
import PopTool from "./PopTool"

export default class SelectionManager {
	constructor() {}

	// Setters

	public static setRange(pvmRange: PVMRange) {
		if (!pvmRange || !pvmRange.start.node || !pvmRange.end.node) return

		let range = document.createRange() // JS Range
		let rangeStartContainer, rangeStartOffset, rangeEndContainer, rangeEndOffset
		let startNodePVMN = pvmRange.start.node
		let startNodeDOM = startNodePVMN.textElement
		let startNodeOffset = pvmRange.start.offset
		let startState = pvmRange.start.state

		// Calculate start
		let travelNode: Node = startNodeDOM.firstChild
		let length = 0
		let loopDone = false

		rangeStartContainer = startNodeDOM
		rangeStartOffset = 0

		if (startState === 5) {
			let sb =pvmRange.start.node.element.querySelectorAll(".selection-break")[pvmRange.start.offset]
			rangeStartContainer = sb
			rangeStartOffset = 0
		} else {
			while (1) {
				if (!travelNode) break
			
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
		}

		range.setStart(rangeStartContainer, rangeStartOffset)

		let endNodePVMN = pvmRange.end.node
		let endNodeDOM = endNodePVMN.textElement
		let endNodeOffset = pvmRange.end.offset
		let endState = pvmRange.end.state

		// Calculate end
		travelNode = endNodeDOM.firstChild
		length = 0
		loopDone = false

		rangeEndContainer = endNodeDOM
		rangeEndOffset = 0

		if (endState === 5) {
			let sb =pvmRange.end.node.element.querySelectorAll(".selection-break")[pvmRange.end.offset]
			rangeEndContainer = sb
			rangeEndOffset = 0
		} else {
			while (1) {
				if (!travelNode) break
			
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
		}

		range.setEnd(rangeEndContainer, rangeEndOffset)

		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)

		// Trigger selectionChange event callback function
		EventManager.onSelectionChanged()
	}

	public static getCurrentRange() {
		// If there is no text selection
		// return range with selected image or other media elements.
		let selectedElm = EditSession.editorBody.querySelector(".node-selected")
		if (selectedElm && window.getSelection().rangeCount === 0) {
			let selectedNode = NodeManager.getNodeByID(NodeManager.getNodeID(selectedElm))
			let r = new PVMRange({
				startNode: selectedNode,
				startOffset: 0,
				endNode: selectedNode,
				endOffset: 0
			})
			return r
		}
		
		let sel = window.getSelection()
		if (
			sel.rangeCount === 0
			|| (sel.rangeCount > 0 && !EditSession.editorBody.contains(sel.getRangeAt(0).startContainer))
		) {
			return
		}
		
		let range = document.getSelection().getRangeAt(0)
		let sc = range.startContainer, ec = range.endContainer
		let closestTarget: Element

		let startNode, endNode
		let startOffset = 0, endOffset = 0
		let startState = undefined, endState = undefined

		if (
			sc.nodeType === 3 ||
			AT.textContainedTags.includes(sc.nodeName.toLocaleLowerCase())
		) {
			for (let i = 0; i < AT.topTags.length; i++) {
				if (sc.nodeType !== 3) {
					closestTarget = <Element> sc
				} else {
					closestTarget = sc.parentElement
				}

				if (closestTarget.closest(AT.topTags[i])) {
					let startElm = closestTarget.closest(AT.topTags[i])
					startNode = NodeManager.getNodeByID(NodeManager.getNodeID(startElm))
					startOffset = this.getTextOffset(startElm, sc, range.startOffset)
					break
				}
			}
		} else {
			let focusedNode = NodeManager.getNodeByChild(sc)
			let selectionBreaks = focusedNode.element.querySelectorAll(".selection-break")
			if (selectionBreaks.length > 0) {
				for (let i = 0; i < selectionBreaks.length; i++) {
					if (selectionBreaks[i].contains(sc)) {
						startNode = focusedNode
						startOffset = i
						startState = 5
						break
					}
				}
			} else {
				return undefined
			}
		}

		if (range.collapsed) {
			endNode = startNode
			endOffset = startOffset
			endState = startState
		} else if (
			ec.nodeType === 3 ||
			AT.textContainedTags.includes(ec.nodeName.toLocaleLowerCase())
		) {
			for (let i = 0; i < AT.topTags.length; i++) {
				if (ec.nodeType !== 3) {
					closestTarget = <Element>ec
				} else {
					closestTarget = ec.parentElement
				}

				if (closestTarget.closest(AT.topTags[i])) {
					let endElm = closestTarget.closest(AT.topTags[i])
					endNode = NodeManager.getNodeByID(NodeManager.getNodeID(endElm))
					endOffset = this.getTextOffset(endElm, ec, range.endOffset)
					break
				}
			}

			if (ec.nodeType !== 3) {
				endOffset = range.endOffset
			}
		} else {
			let focusedNode = NodeManager.getNodeByChild(ec)
			let selectionBreaks = focusedNode.element.querySelectorAll(".selection-break")
			if (selectionBreaks.length > 0) {
				for (let i = 0; i < selectionBreaks.length; i++) {
					if (selectionBreaks[i].contains(ec)) {
						endNode = focusedNode
						endOffset = i
						endState = 5
						break
					}
				}
			} else {
				return undefined
			}
		}

		return new PVMRange({
			startNode: startNode,
			startOffset: startOffset,
			startState: startState,
			endNode: endNode,
			endOffset: endOffset,
			endState: endState
		})
	}

	private static getTextOffset(elm: Element, stopContainer: Node, givenOffset: number): number {
		let n, walk = document.createTreeWalker(elm, NodeFilter.SHOW_TEXT, null, false)
		let offset = 0

		while (n = walk.nextNode()) {
			if (n.isSameNode(stopContainer)) {
				offset += givenOffset
				break
			} else {
				offset += n.textContent.length
			}
		}

		return offset
	}

	public static getCurrentNode(): PVMNode {
		let sel = window.getSelection()

		let nodeSelected = EditSession.editorBody.querySelector(".node-selected")
		if (nodeSelected) {
			return NodeManager.getNodeByElement(nodeSelected)
		}

		// If there is no range
		// return null
		if (sel.rangeCount === 0) return null

		let range = sel.getRangeAt(0)
		let startNode = range.startContainer

		let node: Element = null

		return NodeManager.getNodeByChild(startNode)
	}

	public static getAllNodesInSelection(type?: string): PVMNode[] {
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

	public static getAllNodesInEditor() {
		let travelNode = NodeManager.getFirstChild()
		let allNodes = []
		allNodes.push(travelNode)
		while ((travelNode = travelNode.nextSibling)) {
			allNodes.push(travelNode)
		}

		return allNodes
	}

	/**
	 * Returns current cursor state.
	 * 1. |hello, 2. he|llo, 3. hello|
	 */
	public static getCursorState() {}

	// Deprecated
	// public static getTextOffset(
	// 	node: Node,
	// 	container: Node,
	// 	rangeOffset: number
	// ): number {
	// 	let travelNode: Node = node.firstChild
	// 	let length: number = 0
	// 	let loopDone: boolean = false

	// 	while (1) {
	// 		if (travelNode.nodeType === 3) {
	// 			if (travelNode.isEqualNode(container)) {
	// 				length += rangeOffset
	// 				break
	// 			} else {
	// 				length += travelNode.textContent.length
	// 			}
	// 		}

	// 		if (travelNode.firstChild) {
	// 			travelNode = travelNode.firstChild
	// 		} else if (travelNode.nextSibling) {
	// 			travelNode = travelNode.nextSibling
	// 		} else {
	// 			travelNode = travelNode.parentNode

	// 			while (1) {
	// 				if (travelNode.isEqualNode(node)) {
	// 					loopDone = true
	// 					break
	// 				} else if (travelNode.nextSibling) {
	// 					travelNode = travelNode.nextSibling
	// 					break
	// 				} else {
	// 					travelNode = travelNode.parentNode
	// 				}
	// 			}
	// 		}

	// 		if (loopDone) {
	// 			break
	// 		}
	// 	}

	// 	return length
	// }

	// Actions

	public static focusAt(node: PVMNode, offset: number) {}

	/**
	 * Remove uncollapsed selection.
	 */
	public static removeSelection(withKey: string = "backspace") {
		let jsSel = window.getSelection()
		let jsRange = window.getSelection().getRangeAt(0)
		let pvmRange = this.getCurrentRange()
		let nodes = this.getAllNodesInSelection()
		console.log(nodes)
		// return

		let extraBackspace = true, extraEnter = false

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
				NodeManager.removeChild(nodes[i])
				actions.push({
					type: "remove",
					targetNode: nodes[i],
					nextNode: nextNode,
					previousRange: pvmRange,
					nextRange: pvmRange
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

	// Remove all selections from the editor
	public static releaseNodeSelection() {
		// Remove media selected
		let elms = EditSession.editorBody.querySelectorAll(".node-selected, .caption-focused, .is-selected")
		if (elms.length > 0) {
			elms.forEach(elm => {
				elm.classList.remove("node-selected")
				elm.classList.remove("caption-focused")
				elm.classList.remove("is-selected")
			})
		}
		PopTool.hideImageTool()
	}
}
