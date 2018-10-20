import UndoManager from "./UndoManager"
import NodeManager from "./NodeManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"

export default class PVMEditor
{

	/**
	 * 
	 * @param {Element} editorDOM HTMLElement that id="post-editor"
	 */
	constructor(editorDOM)
	{

		this.editorDOM = editorDOM
		this.toolBar = editorDOM.querySelector("#editor-toolbar")
		this.editorBody = editorDOM.querySelector("#editor-body")

		this.undoMan = new UndoManager()
		this.nodeMan = new NodeManager()
		this.eventMan = new EventManager()
		this.selMan = new SelectionManager()

		this.undoMan.nodeMan = this.nodeMan
		this.undoMan.eventMan = this.eventMan
		this.undoMan.selMan = this.selMan

		this.nodeMan.undoMan = this.undoMan
		this.nodeMan.eventMan = this.eventMan
		this.nodeMan.selMan = this.selMan

		this.selMan.undoMan = this.undoMan
		this.selMan.nodeMan = this.nodeMan
		this.selMan.eventMan = this.eventMan

	}

}