import PVMNodeManager from "./PVMNodeManager"
import PVMEditSession from "./PVMEditSession"
import UndoAction from "./UndoAction"

export default class UndoManager {

	/**
	 * 
	 * @param {PVMEditSession} editSession 
	 */
	constructor(editSession)
	{

		this.session = editSession
		this.sel = editSession.selection

		/**
		 * @name actionStack
		 * @type Array.<UndoAction>
		 */
		this.actionStack = []
		this.currentStep = -1
	}

	/**
	 * 
	 * @param {PVMNodeManager} nodeMan 
	 */
	setNodeManager(nodeMan)
	{
		this.nodeMan = nodeMan
	}

	/**
	 * @return {UndoAction}
	 */
	getLastestAction()
	{
		return this.actionStack[this.currentStep]
	}

	reset()
	{
		
	}

	/**
	 * 
	 * @param {Object} config 
	 */
	record(config)
	{

		let newAction = this.createNewAction(config)

		console.group("Recorded")
		console.log(newAction)
		console.groupEnd()

		this.actionStack.push(newAction)
		this.currentStep = this.actionStack.length - 1
		
	}

	createNewAction(config)
	{
		let action = new UndoAction(config)
		return action
	}

	undo()
	{
		if (this.currentStep < 0) {
			console.info("No more action records to undo.")
			return
		} else {
			console.group("undo")
		}


	}

	redo()
	{

	}

	undoWithAction(action)
	{
		if (action.type === "remove") {
			if (action.nextNode) {
				this.nodeMan.insertChildBefore(action.affectedNode, action.previousNode.nodeID)
			} else {
				this.nodeMan.appendChild(action.affectedNode)
			}
			
			this.sel.setRange(action.before.range)
		}
	}

}