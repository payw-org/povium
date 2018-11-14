import NodeManager from "./NodeManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"
import { Action } from "./Action"

export default class UndoManager {

	nodeMan                   : NodeManager
	eventMan                  : EventManager
	selMan                    : SelectionManager
	editSession               : EditSession
	private static actionStack: Array<Action | Array<Action>> = []
	private static currentStep: number = -1

	constructor() {

		

	}

	/**
	 * Returns the latest undo action.
	 */
	public static getLatestAction() {
		return UndoManager.actionStack[UndoManager.currentStep]
	}

	/**
	 * @param {Array} action
	 */
	public static record(action: Action | Action[]) {
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

	public static undo() {
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

	public static redo() {
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

	private static undoWithAction(action: Action) {
		if (action.type === "remove") {
			NodeManager.insertChildBefore(action.targetNode, action.nextNode)
		}

		if (action.type === "insert") {
			NodeManager.removeChild(action.targetNode)
		}

		if (action.type === "split") {
			NodeManager.mergeNodes(action.targetNodes[0], action.targetNodes[1])
		}

		if (action.type === "merge") {
			NodeManager.insertChildBefore(action.targetNodes[1], action.targetNodes[0].nextSibling)
			action.targetNodes[0].textElement.innerHTML = action.debris
		}

		if (action.type === "textChange") {
			action.targetNode.textElement.innerHTML = action.previousHTML
		}

		if (action.type === "transform") {
			NodeManager.transformNode(action.targetNode, action.previousType, action.previousParentType)
		}

		if (action.type === "textAlign") {
			action.targetNode.textElement.style.textAlign = action.previousDir
		}

		SelectionManager.setRange(action.previousRange)
	}

	private static redoWithAction(action: Action) {
		if (action.type === "remove") {
			NodeManager.removeChild(action.targetNode)
		}

		if (action.type === "insert") {
			NodeManager.insertChildBefore(action.targetNode, action.nextNode)
		}

		if (action.type === "split") {
			action.targetNodes[0].textElement.innerHTML = action.debris
			NodeManager.insertChildBefore(action.targetNodes[1], action.targetNodes[0].nextSibling)
		}

		if (action.type === "merge") {
			NodeManager.mergeNodes(action.targetNodes[0], action.targetNodes[1])
		}

		if (action.type === "textChange") {
			action.targetNode.textElement.innerHTML = action.nextHTML
		}

		if (action.type === "transform") {
			NodeManager.transformNode(action.targetNode, action.nextType, action.nextParentType)
		}

		if (action.type === "textAlign") {
			action.targetNode.textElement.style.textAlign = action.nextDir
		}

		SelectionManager.setRange(action.nextRange)
	}

}
