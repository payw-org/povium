import NodeManager from "./NodeManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"
import { Action } from "./Action"

export default class UndoManager {

	nodeMan: NodeManager
	eventMan: EventManager
	selMan: SelectionManager
	editSession: EditSession
	private static actionStack: Array<Action | Array<Action>> = []
	private static currentStep: number = -1

	constructor() {

		

	}

	/**
	 * Returns the latest undo action.
	 */
	getLatestAction() {
		return UndoManager.actionStack[UndoManager.currentStep]
	}

	/**
	 * @param {Array} action
	 */
	record(action: Action | Action[]) {
		// console.log(action)
		if (!Array.isArray(action)) {
			if (action.finalAction) {
				let latestAction = this.getLatestAction()
				if (latestAction && Array.isArray(latestAction)) {
					latestAction.push(action)
					return
				}
			}
		}
		UndoManager.actionStack.length = UndoManager.currentStep + 1
		UndoManager.actionStack.push(action)
		UndoManager.currentStep = UndoManager.actionStack.length - 1
		// console.log(this.actionStack.slice(0))
	}

	undo() {
		if (UndoManager.currentStep < 0) {
			// console.info("No more action records to undo.")
			return
		} else {
			// console.group("undo")
		}

		let actions = UndoManager.actionStack[UndoManager.currentStep--]

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
		if (UndoManager.currentStep >= UndoManager.actionStack.length - 1) {
			// console.info('No more actions to recover')
			return
		} else {
			// console.group('redo')
		}

		let actions = UndoManager.actionStack[++UndoManager.currentStep]

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
