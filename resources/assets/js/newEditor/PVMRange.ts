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
	state: string
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

	constructor(args: {
		startNode: PVMNode,
		startOffset: number,
		startState?: number,
		endNode: PVMNode,
		endOffset: number,
		endState?: number
	}) {
		// Properties
		this.setStart(args.startNode, args.startOffset, args.startState)
		this.setEnd(args.endNode, args.endOffset, args.endState)
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

	setStart(startNode: PVMNode, startOffset: number, startState?: number) {
		if (!startNode) {
			return
		}

		this.start.node = startNode
		this.start.offset = startOffset

		if (startState) {
			this.start.state = startState
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

	setEnd(endNode: PVMNode, endOffset: number, endState?: number) {
		if (!endNode) {
			return
		}

		this.end.node = endNode
		this.end.offset = endOffset

		if (endState) {
			this.end.state = endState
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
			this.end.state = 2
		}
	}

	setState() {}

	// Getters

	getState() {}

	clone() {
		let sel = new SelectionManager()
		let range = new PVMRange({
			startNode: this.start.node,
			startOffset: this.start.offset,
			startState: this.start.state,
			endNode: this.end.node,
			endOffset: this.end.offset,
			endState: this.end.state
		})
		return range
	}

	// Actions
}
