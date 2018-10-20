import PVMEditSession from "./PVMEditSession"
import PopTool from "./PopTool"

export default class PVMEditor {

	/**
	 * 
	 * @param {PVMEditSession} editSession 
	 */
	constructor(editSession)
	{
		this.session = editSession
		this.sel = editSession.selection
		this.nodeMan = editSession.pvmNodeManager
		this.undoMan = editSession.undoManager
		this.eventMan = editSession.eventManager
		this.popTool = new PopTool(editSession, this.sel)
		this.eventMan.setPopTool(this.popTool)
		this.eventMan.setEditor(this)
		this.eventMan.attachEvents()

		this.firstPVMNode = this.nodeMan.createNode(this.session.editorBody.firstElementChild)
		this.lastPVMNode = this.nodeMan.createNode(this.session.editorBody.lastElementChild)

		this.attachEvents()

		// let range = this.sel.createRange(this.nodeMan.getChildByID(1), 0, this.nodeMan.getChildByID(1), 2)
		// let range = this.sel.createRange(this.nodeMan.getChildByID(1), 1, this.nodeMan.getChildByID(1), 2)
		// this.sel.setRange(range)

	}

	// Methods

	// Actions

	// Events

	attachEvents()
	{
		// this.session.editorBody.addEventListener("keydown", (e) => {
		// 	let keyCode = e.which
		// 	// console.log(keyCode)
		// 	if (keyCode === 13) {
		// 		e.preventDefault()
		// 		this.onPressEnter()
		// 	}

		// 	// windows: backspace
		// 	// macOS:   delete
		// 	if (keyCode === 8) {
		// 		this.onPressBakcspace(e)
		// 	}

		// })

		this.session.editorBody.addEventListener("click", () => {
			// console.log(this.sel.getCurrentRange())
			// console.log(this.sel.getAllNodesInRange())
		})
	}

	/**
	 * 
	 * @param {KeyboardEvent} e 
	 */
	onPressEnter(e)
	{
		let currentRange = this.sel.getCurrentRange()
		let isRangeCollapsed = currentRange.isCollapsed()

		if (isRangeCollapsed) {

			let currentNode = this.sel.getCurrentTextNode()
			let nextNode = currentNode.getNextSibling()
			let newNode, newRange

			if (currentRange.start.state === 3 || currentRange.start.state === 4) {

				if (currentNode.type === "LI") {
					if (currentRange.start.state === 4) {
						this.nodeMan.transformNode(currentNode, 'P')
						this.sel.setRange(this.sel.createRange(currentNode, 0, currentNode, 0))
					} else {
						newNode = this.nodeMan.createEmptyNode("LI", currentNode.parentType)
						newRange = this.sel.createRange(newNode, 0, newNode, 0)
						this.nodeMan.insertChildBefore(newNode, currentNode.getNextSibling().nodeID, {
							beforeRange: currentRange,
							afterRange: newRange,
							nextNode: nextNode
						})
						this.sel.setRange(newRange)
					}
				} else {
					newNode = this.nodeMan.createEmptyNode("P")
					console.log(newNode)
					newRange = this.sel.createRange(newNode, 0, newNode, 0)
					this.nodeMan.insertChildBefore(newNode, currentNode.getNextSibling().nodeID, {
						beforeRange: currentRange,
						afterRange: newRange,
						nextNode: nextNode
					})
					this.sel.setRange(newRange)
				}

			} else if (currentRange.start.state === 1) {
				newNode = this.nodeMan.createEmptyNode(currentNode.type, currentNode.parentType)
				this.nodeMan.insertChildBefore(newNode, currentRange.start.nodeID, {
					beforeRange: currentRange,
					afterRange: currentRange,
					nextNode: currentNode
				})
			} else {
				if (currentNode.type === "FIGURE") return
				this.nodeMan.splitElementNode3()
			}

		} else {
			console.log("range is not collapsed")
		}
	}

	/**
	 * 
	 * @param {KeyboardEvent} e 
	 */
	onPressBackspace(e)
	{

		let currentRange = this.sel.getCurrentRange()
		let currentNode = this.sel.getCurrentTextNode()
		let previousNode = currentNode.getPreviousSibling()

		if (currentRange.isCollapsed()) {
			if (currentNode.type === "FIGURE" && (currentRange.start.state === 1 || currentRange.start.state === 4)) {
				e.preventDefault()
				return
			}

			if (currentRange.start.state === 1 || currentRange.start.state === 4) {
				this.undoMan.clearTXundoAction(currentNode.innerHTML, currentRange)
			}

			if (currentRange.start.state === 1) {

				e.preventDefault()

				if (currentNode.type === "LI") {

					// currentNode.transformTo("P")
					this.nodeMan.transformNode(currentNode, "P")
					this.sel.setRange(this.sel.createRange(currentNode, 0, currentNode, 0))

				} else if (previousNode && previousNode.type === "FIGURE") {

					this.nodeMan.removeChild(previousNode.nodeID, {
						beforeRange: currentRange,
						afterRange: currentRange
					})

				} else {

					// PreviousNode is empty
					if (previousNode && previousNode.textContent.length === 0) {

						this.nodeMan.removeChild(previousNode.nodeID)

					} else {

						this.nodeMan.mergeNodes(currentNode.getPreviousSibling(), currentNode)

					}
				}
				
			} else if (currentRange.start.state === 4) {

				e.preventDefault()

				if (!previousNode || currentNode.type === 'LI') {

					// No previousNode. It should be the first line.
					// currentNode.transformTo("P")
					this.nodeMan.transformNode(currentNode, 'P')
					this.sel.setRange(this.sel.createRange(currentNode, 0, currentNode, 0))

				} else {

					if (previousNode && previousNode.type === "FIGURE") {
						this.nodeMan.removeChild(previousNode.nodeID, {
							beforeRange: currentRange,
							afterRange: currentRange
						})
					} else {
						let nextRange = this.sel.createRange(previousNode, previousNode.textContent.length, previousNode, previousNode.textContent.length)
						this.sel.setRange(nextRange)
						this.nodeMan.removeChild(currentNode.nodeID, {
							beforeRange: currentRange,
							afterRange: nextRange
						})
					}

					

				}
			}
		} else {
			
			// The range is not collapsed
			e.preventDefault()
			this.sel.removeSelection()

		}
	}

	/**
	 * 
	 * @param {KeyboardEvent} e 
	 */
	onPressDelete(e)
	{
		let currentRange = this.sel.getCurrentRange()
		let currentNode = this.sel.getCurrentTextNode()
		let nextNode = currentNode.getNextSibling()

		if (currentRange.isCollapsed()) {

			if (
				currentNode.type === "FIGURE" &&
				(currentRange.start.state === 1 || currentRange.start.state === 4)
			) {
				e.preventDefault()
				return
			}

			if (currentRange.start.state === 3 || currentRange.start.state === 4) {
				this.undoMan.clearTXundoAction(currentNode.innerHTML, currentRange)
			}

			if (currentRange.start.state === 3) {

				e.preventDefault()

				if (nextNode && nextNode.type === "FIGURE") {

					this.nodeMan.removeChild(nextNode.nodeID, {
						beforeRange: currentRange,
						afterRange: currentRange
					})

				} else {

					this.nodeMan.mergeNodes(currentNode, nextNode)

				}

			} else if (currentRange.start.state === 4) {

				e.preventDefault()

				let newRange = this.sel.createRange(nextNode, 0, nextNode, 0)

				this.nodeMan.removeChild(currentNode.nodeID, {
					beforeRange: currentRange,
					afterRange: newRange
				})
				this.sel.setRange(newRange)

			}

		}
	}

	// is-

	isFocused()
	{
		return this.session.editorBody === document.activeElement
	}

	// Setter

	/**
	 * Fetches post.json data from the server and converts it to DOMs.
	 */
	initEditor()
	{

	}

	// Getters

	// Actions



}