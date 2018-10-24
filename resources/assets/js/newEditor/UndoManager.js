import NodeManager from "./NodeManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"
import Action from "./Action"

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
		 * @type {Action[]}
		 */
		this.actionStack = []
		this.currentStep = -1

	}

}
