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
		this.isLinked = false
		/**
		 * @type {PVMNode}
		 */
		this.affectedNode = null
		/**
		 * @type {number}
		 */
		this.affectedNodeID = null
		/**
		 * @type {PVMNode}
		 */
		this.nextNode = null
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
		if ('type' in config) this.type = config.type
		if ('isLinked' in config) this.isLinked = config.isLinked
		if ('affectedNode' in config) this.affectedNode = config.affectedNode
		if ('affectedNodeID' in config) this.affectedNodeID = config.affectedNodeID
		if ('mergedNodes' in config) this.mergedNodes = config.mergedNodes
		if ('nextNode' in config) this.nextNode = config.nextNode
		if ('nextNodeID' in config) this.nextNodeID = config.nextNodeID
		if ('before' in config) this.before = config.before
		if ('after' in config) this.after = config.after
		if ('key' in config) this.key = config.key
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