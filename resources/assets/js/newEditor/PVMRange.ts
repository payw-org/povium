import PVMNode from "./PVMNode"
import SelectionManager from "./SelectionManager"

interface RangePoint {
	node  : PVMNode
	offset: number
	state : number
}

export default class PVMRange {

	start: RangePoint = {
		node: undefined,
		offset: undefined,
		state: 2
	}
	end  : RangePoint = {
		node: undefined,
		offset: undefined,
		state: 2
	}

	constructor(startNode: PVMNode, startOffset: number, endNode: PVMNode, endOffset: number) {

		// Properties

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

	setStart(startNode: PVMNode, startOffset: number) {
		this.start.node   = startNode
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

	setEnd(endNode: PVMNode, endOffset: number) {
		this.end.node   = endNode
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
		let sel   = new SelectionManager()
		let range = SelectionManager.createRange(this.start.node, this.start.offset, this.end.node, this.end.offset)
		return range
	}

	// Actions

}