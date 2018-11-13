import PVMNode from "./PVMNode"
import SelectionManager from "./SelectionManager";

export default class PVMRange {

	/**
	 * 
	 * @param {PVMNode} startNode
	 * @param {number} startOffset 
	 * @param {PVMNode} endNode
	 * @param {number} endOffset 
	 */
	constructor(startNode = null, startOffset = null, endNode = null, endOffset = null) {

		// Properties

		this.start = {
			/**
			 * @type {PVMNode}
			 */
			node: null,
			offset: null,
			state: 2
		}

		this.end = {
			/**
			 * @type {PVMNode}
			 */
			node: null,
			offset: null,
			state: 2
		}

		this.setStart(startNode, startOffset)
		this.setEnd(endNode, endOffset)

	}

	// Methods

	// is-

	isMultiLine() {
		return this.start.node.id !== this.end.node.id
	}

	isCollapsed() {
		if (this.start.node && this.end.node) {
			return this.start.node.id === this.end.node.id && this.start.offset === this.end.offset
		} else {
			return false
		}
	}

	// Setters

	/**
	 * Sets the starting point of the range.
	 * @param {PVMNode} startNode 
	 * @param {Number} startOffset 
	 */
	setStart(startNode, startOffset) {
		this.start.node = startNode
		this.start.offset = startOffset
		if (!startNode) {
			return
		}
		if (startNode.getTextContent().length === startOffset) {
			if (startNode.getTextContent().length === 0) {
				this.start.state = 4
			} else {
				this.start.state = 3
			}
		} else if (startOffset === 0) {
			this.start.state = 1
		} else {
			this.start.state = 2
		}
	}

	/**
	 * Sets the ending point of the range.
	 * @param {PVMNode} endNode 
	 * @param {Number} endOffset 
	 */
	setEnd(endNode, endOffset) {
		this.end.node = endNode
		this.end.offset = endOffset
		if (!endNode) {
			return
		}
		if (endNode.getTextContent().length === endOffset) {
			if (endNode.getTextContent().length === 0) {
				this.end.state = 4
			} else {
				this.end.state = 3
			}
		} else if (endOffset === 0) {
			this.end.state = 1
		} else {
			this.start.state = 2
		}
	}

	setState() {

	}


	// Getters

	getState() {

	}

	clone() {
		let sel = new SelectionManager()
		let range = sel.createRange(this.start.node, this.start.offset, this.end.node, this.end.offset)
		return range
	}

	// Actions

}