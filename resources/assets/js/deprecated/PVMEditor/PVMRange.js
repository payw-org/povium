import PVMNode from "./PVMNode";

export default class PVMRange {

	/**
	 * 
	 * @param {PVMNode} startNode
	 * @param {number} startOffset 
	 * @param {PVMNode} endNode
	 * @param {number} endOffset 
	 */
	constructor(startNode = null, startOffset = null, endNode = null, endOffset = null)
	{

		// Properties

		this.start = {
			node: null,
			nodeID: null,
			offset: startOffset,
			state: 0
		}

		this.end = {
			node: null,
			nodeID: null,
			offset: endOffset,
			state: 0
		}

		if (startNode) {
			this.start.node = startNode
			this.start.nodeID = startNode.nodeID
		}

		if (endNode) {
			this.end.node = endNode
			this.end.nodeID = endNode.nodeID
		}

		if (startNode && startNode.dom.textContent.length === startOffset) {
			if (startNode.dom.textContent.length === 0) {
				this.start.state = 4
			} else {
				this.start.state = 3
			}
		} else if (startNode && startOffset === 0) {
			this.start.state = 1
		} else if (!startNode) {
			this.start.state = 2
		}

		if (endNode && endNode.dom.textContent.length === endOffset) {
			if (endNode.dom.textContent.length === 0) {
				this.end.state = 4
			} else {
				this.end.state = 3
			}
		} else if (endNode && endOffset === 0) {
			this.end.state = 1
		} else if (!endNode) {
			this.end.state = 2
		}

	}

	// Methods

	// is-

	isMultiLine()
	{
		return this.start.nodeID !== this.end.nodeID
	}

	isCollapsed()
	{
		return this.start.nodeID === this.end.nodeID && this.start.offset === this.end.offset
	}

	// Setters

	/**
	 * Sets the starting point of the range.
	 * @param {PVMNode} startNode 
	 * @param {Number} startOffset 
	 */
	setStart(startNode, startOffset)
	{
		this.start.node = startNode
		this.start.nodeID = startNode.nodeID
		this.start.offset = startOffset
		if (startNode.dom.textContent.length === startOffset) {
			if (startNode.dom.textContent.length === 0) {
				this.start.state = 4
			} else {
				this.start.state = 3
			}			
		} else if (startOffset === 0) {
			this.start.state = 1
		}
	}

	/**
	 * Sets the ending point of the range.
	 * @param {PVMNode} endNode 
	 * @param {Number} endOffset 
	 */
	setEnd(endNode, endOffset)
	{
		this.end.node = endNode
		this.end.nodeID = endNode.nodeID
		this.end.offset = endOffset
		if (endNode.dom.textContent.length === endOffset) {
			if (endNode.dom.textContent.length === 0) {
				this.end.state = 4
			} else {
				this.end.state = 3
			}
		} else if (endOffset === 0) {
			this.end.state = 1
		}
	}

	setState()
	{

	}


	// Getters

	getState()
	{

	}

	// Actions

}