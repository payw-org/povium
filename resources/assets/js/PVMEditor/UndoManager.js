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

			this.nodeMan.transformNode(action.affectedNode, action.before.type, false, action.before.parentType)

		} else if (action.type === 'textChange') {

			if (action.affectedNode && !action.affectedNode.dom.parentElement) {
				action.affectedNode.dom = this.nodeMan.getNodeByID(action.affectedNode.nodeID).dom
			}
			action.affectedNode.setInnerHTML(action.before.innerHTML)

		} else if (action.type === "merge") {

			this.sel.setRange(action.after.range)
			this.nodeMan.splitElementNode3(action.mergedNodes[1].nodeID, false)
			let splittedNode = this.nodeMan.getNodeByID(action.mergedNodes[1].nodeID)
			splittedNode.parentType = action.mergedNodes[1].parentType
			this.nodeMan.transformNode(splittedNode, action.mergedNodes[1].type, false, splittedNode.parentType)

		} else if (action.type === "split") {

			let node1 = this.nodeMan.getNodeByID(action.before.range.start.nodeID)
			let node2 = this.nodeMan.getNodeByID(action.after.range.start.nodeID)
			this.nodeMan.mergeNodes(node1, node2, true, false)

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

			this.nodeMan.transformNode(action.affectedNode, action.after.type, false, action.after.parentType)

		} else if (action.type === 'textChange') {

			if (action.affectedNode && !action.affectedNode.dom.parentElement) {
				action.affectedNode.dom = this.nodeMan.getNodeByID(action.affectedNode.nodeID).dom
			}
			action.affectedNode.setInnerHTML(action.after.innerHTML)

		} else if (action.type === "merge") {

			let node1 = this.nodeMan.getNodeByID(action.mergedNodes[0].nodeID)
			let node2 = this.nodeMan.getNodeByID(action.mergedNodes[1].nodeID)
			this.nodeMan.mergeNodes(node1, node2, true, false)

		} else if (action.type === "split") {

			this.sel.setRange(action.before.range)
			this.nodeMan.splitElementNode3(action.after.range.start.nodeID, false)

		}

		this.sel.setRange(action.after.range)

	}

	clearTXundoAction(html, range)
	{
		let lastAction = this.getLastestAction()
		if (lastAction && lastAction.type === "textChange") {
			lastAction.after = {
				innerHTML: html,
				range: range
			}
		}
	}

}