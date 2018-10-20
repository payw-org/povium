import NodeManager from "./NodeManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"

export default class UndoManager
{

	constructor()
	{
		/**
		 * @type NodeManager
		 */
		this.nodeMan = null
		/**
		 * @type EventManager
		 */
		this.eventMan = null
		/**
		 * @type SelectionManager
		 */
		this.selMan = null
	}

}