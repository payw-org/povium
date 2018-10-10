import PVMSelection from "./PVMSelection"
import UndoManager from "./UndoManager"
import PVMNodeManager from "./PVMNodeManager"
import EventManager from "./EventManager"

export default class PVMEditSession {

	/**
	 * 
	 * @param {Element} container 
	 */
	constructor(container)
	{

		this.container = container
		this.editorBody = container.querySelector('#editor-body')
		this.editorToolbar = container.querySelector('#editor-toolbar')

		this.selection = new PVMSelection(this)
		this.undoManager = new UndoManager(this)
		this.pvmNodeManager = new PVMNodeManager(this)
		this.eventManager = new EventManager(this)
		
		this.selection.setNodeManager(this.pvmNodeManager)
		this.undoManager.setNodeManager(this.pvmNodeManager)

		this.lastNodeID = 100

	}

	// Methods

	// Setters

	// Actions



}