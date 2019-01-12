import PVMNode from "./PVMNode"
import SelectionManager from "./SelectionManager"

interface RangePoint {
	node: PVMNode
	offset: number

	// 1: start of paragraph
	// 2: middle of paragraph
	// 3: end of paragraph
	// 4: empty paragraph
	// 5: medea select
	state: number
}

export default class PVMRange {
	collapsed: boolean
	start: RangePoint = {
		node: undefined,
		offset: undefined,
		state: undefined
	}
	end: RangePoint = {
		node: undefined,
		offset: undefined,
		state: undefined
	}

	constructor(
		startNode: PVMNode,
		startOffset: number,
		endNode: PVMNode,
		endOffset: number,
		itself: boolean
	) {
		// Properties
		this.setStart(startNode, startOffset)
		this.setEnd(endNode, endOffset)
		this.collapsed = this.isCollapsed()
	}

	// Methods

	// is-

	isMultiLine() {
		return this.start.node.id !== this.end.node.id
	}

	isCollapsed() {
		if (this.start.node && this.end.node) {
			return (
				this.start.node.id === this.end.node.id &&
				this.start.offset === this.end.offset
			)
		} else {
			return false
		}
	}

	// Setters

	setStart(startNode: PVMNode, startOffset: number) {
		if (!startNode) {
			return
		}

		this.start.node = startNode

		if (this.itself) {
			return
		}

		this.start.offset = startOffset

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
		if (!endNode) {
			return
		}

		this.end.node = endNode

		if (this.itself) {
			return
		}

		this.end.offset = endOffset

		if (endNode.getTextContent().length === endOffset) {
			if (endNode.getTextContent().length === 0) {
				this.end.state = 4
			} else {
				this.end.state = 3
			}
		} else if (endOffset === 0) {
			this.end.state = 1
		} else {
			this.end.state = 2
		}
	}

	setState() {}

	// Getters

	getState() {}

	clone() {
		let sel = new SelectionManager()
		let range = SelectionManager.createRange(
			this.start.node,
			this.start.offset,
			this.end.node,
			this.end.offset
		)
		return range
	}

	// Actions
}
