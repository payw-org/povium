import PVMEditSession from "./PVMEditSession"
import PVMRange from "./PVMRange"
import PVMNode from "./PVMNode"
import AN from "./config/availableNodes"
import PVMNodeManager from "./PVMNodeManager";

export default class PVMSelection {
	
	/**
	 * 
	 * @param {PVMEditSession} editSession 
	 */
	constructor(editSession)
	{
		// Properties
		this.session = editSession

		this.cursorState

		this.currentState = {
			/**
			 * @type {number}
			 */
			nodeID: null,
			/**
			 * @type {string}
			 */
			innerHTML: null,
			/**
			 * @type {PVMRange}
			 */
			range: null
		}

		// this.session.editorBody.addEventListener("click", () => {
		// 	console.log(this.getCurrentRange())
		// })

	}

	// Methods

	// Events

	onSelectionChanged()
	{

		let currentRange = this.getCurrentRange()
		this.currentState.range = currentRange
		let currentNode = this.getCurrentTextNode()
		this.currentState.innerHTML = currentNode.innerHTML
		
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
	setRange(pvmRange)
	{
		let range = document.createRange() // JS Range
		let rangeStartContainer, rangeStartOffset, rangeEndContainer, rangeEndOffset
		let startNodeID = pvmRange.start.nodeID
		let startNodePVMN = this.nodeMan.getNodeByID(startNodeID)
		if (!startNodePVMN) {
			console.error("Couldn't find the node.", startNodeID)
			return
		}
		let startNodeDOM = startNodePVMN.getTextDOM()
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
		
		let endNodeID = pvmRange.end.nodeID
		let endNodePVMN = this.nodeMan.getNodeByID(endNodeID)
		if (!endNodePVMN) {
			console.error("Couldn't find the node.", endNodeID)
			return
		}
		let endNodeDOM = endNodePVMN.getTextDOM()
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

		this.onSelectionChanged()

	}

	// Getters

	/**
	* Returns the PVMRange for the selected part.
	* @returns {PVMRange}
	*/
	getCurrentRange()
	{
		let pvmRange = new PVMRange()

		let startCursorState, endCursorState
		
		if (document.getSelection().rangeCount === 0) {
			return null
		}

		let range = document.getSelection().getRangeAt(0)

		let closestTarget

		for (let i = 0; i < AN.all.length; i++) {

			if (range.startContainer.closest) {
				closestTarget = range.startContainer
			} else {
				closestTarget = range.startContainer.parentElement
			}
			
			if (closestTarget.closest(AN.all[i])) {
				let startNode = closestTarget.closest(AN.all[i])
				pvmRange.setStart(this.nodeMan.createNode(startNode), this.getTextOffset(startNode, range.startContainer, range.startOffset))
				break
			}
		}

		for (let i = 0; i < AN.all.length; i++) {

			if (range.endContainer.closest) {
				closestTarget = range.endContainer
			} else {
				closestTarget = range.endContainer.parentElement
			}
			
			if (closestTarget.closest(AN.all[i])) {
				let endNode = closestTarget.closest(AN.all[i])
				pvmRange.setEnd(this.nodeMan.createNode(endNode), this.getTextOffset(endNode, range.endContainer, range.endOffset))
				break
			}
		}

		return pvmRange
		
	}

	getCurrentTextNode()
	{
		let sel = window.getSelection()
		if (sel.rangeCount === 0) return null

		let range = sel.getRangeAt(0)
		let startNode = range.startContainer
		let node = null

		for (let i = 0; i < AN.all.length; i++) {
			if (startNode.closest) {
				node = startNode.closest(AN.all[i])
			} else {
				node = startNode.parentElement.closest(AN.all[i])
			}
			
			if (node) {
				break
			} else {

			}
		}

		if (!node) {
			return null
		}

		return this.nodeMan.createNode(node)
	}

	/**
	 * @return {Array.<PVMNode>}
	 */
	getAllNodesInRange()
	{
		let currentRange = this.getCurrentRange()
		let startID = currentRange.start.nodeID
		let endID = currentRange.end.nodeID

		let nodes = []

		let travelNode = this.nodeMan.getNodeByID(startID)
		let nextNode

		while (1) {
			nodes.push(travelNode)

			if (travelNode.nodeID === endID) break

			nextNode = travelNode.getNextSibling()

			if (!nextNode) break

			travelNode = nextNode

		}

		return nodes


	}

	getAllNodesInEditor()
	{
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
	getCursorState()
	{

	}

	/**
	 * 
	 * @param {Node} node 
	 * @param {Node} container 
	 * @param {number} rangeOffset 
	 * @return {number}
	 */
	getTextOffset(node, container, rangeOffset)
	{

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
	createRange(startNode, startOffset, endNode, endOffset)
	{

		let range = new PVMRange(startNode, startOffset, endNode, endOffset)
		return range
	}

	/**
	 * 
	 * @param {PVMNode} node 
	 * @param {number} offset 
	 */
	focusAt(node, offset)
	{

	}

	removeSelection()
	{
		let nodes = this.getAllNodesInRange()
		nodes.forEach(node => {
			console.log(node)
		})
	}

}