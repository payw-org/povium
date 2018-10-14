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
	 * @param {string} config.type
	 * @param {PVMNode} config.affectedNode
	 * @param {Object} config.before
	 * @param {PVMRange} config.before.range
	 * @param {string=} config.before.type
	 * @param {Object} config.after
	 * @param {PVMRange} config.after.range
	 * @param {string=} config.after.type
	 */
	record(config)
	{

		let newAction = this.createNewAction(config)

		console.group("Recorded")
		console.log(newAction)
		console.groupEnd()

		this.actionStack.length = this.currentStep + 1
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

		let action = this.actionStack[this.currentStep--]
		this.undoWithAction(action)

		console.log(action)
		console.groupEnd()


	}

	redo()
	{
		if (this.currentStep >= this.actionStack.length - 1) {
			console.info('No more actions to recover')
			return
		} else {
			console.group('redo')
		}

		let action = this.actionStack[++this.currentStep]
		console.log(action)
		this.redoWithAction(action)
		console.groupEnd()
	}

	/**
	 * 
	 * @param {UndoAction} action 
	 */
	undoWithAction(action)
	{

		if (action.affectedNode && !action.affectedNode.dom.parentElement) {
			action.affectedNode.dom = this.nodeMan.getChildByID(action.affectedNode.nodeID).dom
		}

		if (action.nextNode && !action.nextNode.dom.parentElement) {
			action.nextNode.dom = this.nodeMan.getChildByID(action.nextNode.nodeID).dom
		}

		if (action.type === 'remove') {

			if (action.nextNode) {
				this.nodeMan.insertChildBefore(action.affectedNode, action.nextNode.nodeID)
			} else {
				this.nodeMan.appendChild(action.affectedNode)
			}
			
			this.sel.setRange(action.before.range)

		} else if (action.type === 'insert') {

			this.nodeMan.removeChild(action.affectedNode.nodeID)

		} else if (action.type === 'transform') {

			this.nodeMan.transformNode(action.affectedNode, action.before.type, false)

		} else if (action.type === 'textChange') {

			action.affectedNode.setInnerHTML(action.before.innerHTML)

		}

		this.sel.setRange(action.before.range)

	}

	/**
	 * 
	 * @param {UndoAction} action 
	 */
	redoWithAction(action)
	{
		if (action.type === 'remove') {

			this.nodeMan.removeChild(action.affectedNode.nodeID)

		} else if (action.type === 'insert') {

			if (action.nextNode) {
				this.nodeMan.insertChildBefore(action.affectedNode, action.nextNode.nodeID)
			} else {
				this.nodeMan.appendChild(action.affectedNode)
			}

		} else if (action.type === 'transform') {

			this.nodeMan.transformNode(action.affectedNode, action.after.type, false)

		} else if (action.type === 'textChange') {

			action.affectedNode.setInnerHTML(action.after.innerHTML)

		}

		this.sel.setRange(action.after.range)

	}

}