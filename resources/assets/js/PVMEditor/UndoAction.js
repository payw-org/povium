import PVMNode from "./PVMNode"

export default class UndoAction {

	constructor(config)
	{
		/**
		 * @type {string}
		 */
		this.type = null
		/**
		 * @type {boolean}
		 */
		this.isLinked = null
		/**
		 * @type {PVMNode}
		 */
		this.affectedNode = null
		/**
		 * @type {Object}
		 */
		this.before = null
		/**
		* @type {Object}
		*/
		this.after = null

		/**
		* @type {string}
		*/
		this.key = null

		this.setAction(config)
	}

	setAction(config)
	{
		if ("type" in config) this.type = config.type
		if ("isLinked" in config) this.isLinked = config.isLinked
		if ("affectedNode" in config) this.affectedNode = config.affectedNode
		if ("before" in config) this.before = config.before
		if ("after" in config) this.after = config.after
		if ("key" in config) this.key = config.key
	}

	setBefore(before)
	{
		this.before = before
	}

	setAfter(after)
	{
		this.after = after
	}

}