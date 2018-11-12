import NodeManager from "./NodeManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"

export default class UndoManager {

	constructor() {

		/**
		 * @type {NodeManager}
		 */
		this.nodeMan = null
		/**
		 * @type {EventManager}
		 */
		this.eventMan = null
		/**
		 * @type {SelectionManager}
		 */
		this.selMan = null
		/**
		 * @type {EditSession}
		 */
		this.editSession = null

		/**
		 * @type {Array}
		 */
		this.actionStack = []
		this.currentStep = -1

	}

	getLatestAction() {
		return this.actionStack[this.currentStep]
	}

	/**
	 * @param {Array} action
	 */
	record(action) {
		// console.log(action)
		if (!Array.isArray(action)) {
			if (action.finalAction) {
				if (this.getLatestAction() && Array.isArray(this.getLatestAction())) {
					this.getLatestAction().push(action)
					return
				}
			}
		}
		this.actionStack.length = this.currentStep + 1
		this.actionStack.push(action)
		this.currentStep = this.actionStack.length - 1
		// console.log(this.actionStack.slice(0))
	}

	undo() {
		if (this.currentStep < 0) {
			// console.info("No more action records to undo.")
			return
		} else {
			// console.group("undo")
		}

		let actions = this.actionStack[this.currentStep--]

		if (Array.isArray(actions)) {
			for (let i = actions.length - 1; i >= 0; i--) {
				this.undoWithAction(actions[i])
			}
		} else {
			this.undoWithAction(actions)
		}

		// console.groupEnd()
	}

	redo() {
		if (this.currentStep >= this.actionStack.length - 1) {
			// console.info('No more actions to recover')
			return
		} else {
			// console.group('redo')
		}

		let actions = this.actionStack[++this.currentStep]

		if (Array.isArray(actions)) {
			for (let i = 0; i < actions.length; i++) {
				this.redoWithAction(actions[i])
			}
		} else {
			this.redoWithAction(actions)
		}

		// console.groupEnd()
	}

	undoWithAction(action) {
		if (action.type === "remove") {
			this.nodeMan.insertChildBefore(action.targetNode, action.nextNode)
		}

		if (action.type === "insert") {
			this.nodeMan.removeChild(action.targetNode)
		}

		if (action.type === "split") {
			this.nodeMan.mergeNodes(action.targetNodes[0], action.targetNodes[1])
		}

		if (action.type === "merge") {
			this.nodeMan.insertChildBefore(action.targetNodes[1], action.targetNodes[0].nextSibling)
			action.targetNodes[0].textElement.innerHTML = action.debris
		}

		if (action.type === "textChange") {
			action.targetNode.textElement.innerHTML = action.previousHTML
		}

		if (action.type === "transform") {
			this.nodeMan.transformNode(action.targetNode, action.previousType, action.previousParentType)
		}

		if (action.type === "textAlign") {
			action.targetNode.textElement.style.textAlign = action.previousDir
		}

		this.selMan.setRange(action.previousRange)
	}

	redoWithAction(action) {
		if (action.type === "remove") {
			this.nodeMan.removeChild(action.targetNode)
		}

		if (action.type === "insert") {
			this.nodeMan.insertChildBefore(action.targetNode, action.nextNode)
		}

		if (action.type === "split") {
			action.targetNodes[0].textElement.innerHTML = action.debris
			this.nodeMan.insertChildBefore(action.targetNodes[1], action.targetNodes[0].nextSibling)
		}

		if (action.type === "merge") {
			this.nodeMan.mergeNodes(action.targetNodes[0], action.targetNodes[1])
		}

		if (action.type === "textChange") {
			action.targetNode.textElement.innerHTML = action.nextHTML
		}

		if (action.type === "transform") {
			this.nodeMan.transformNode(action.targetNode, action.nextType, action.nextParentType)
		}

		if (action.type === "textAlign") {
			action.targetNode.textElement.style.textAlign = action.nextDir
		}

		this.selMan.setRange(action.nextRange)
	}

}
