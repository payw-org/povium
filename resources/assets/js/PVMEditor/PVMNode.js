import AN from "./config/availableNodes"

export default class PVMNode {

	/**
	 *
	 * @param {Element} node
	 */
	constructor(node)
	{

		/**
			@name dom
			@type HTMLElement
			@default null
		*/
		this.dom = null
		this.nodeID = null
		this.type = null
		this.parentType = null

		if (AN.all.includes(node.nodeName)) {
			this.dom = node
			if (node.nodeName === "LI") {
				this.parentType = "UL"
				if (
					this.dom.parentElement &&
					(this.dom.parentElement.nodeName === "UL" ||
					this.dom.parentElement.nodeName === "OL")
				) {
					this.parentType = this.dom.parentElement.nodeName
				}
			}
		} else {

			if (
				node.nodeName === "UL" ||
				node.nodeName === "OL"
			) {
				let firstChildLI = node.querySelector('li')

				if (firstChildLI) {
					this.dom = firstChildLI
				}

				this.parentType = node.nodeName

			} else {
				console.error("Couldn't create a PVMNode with this node: ", node)
				return null
			}

		}

		this.type = this.dom.nodeName
		if (this.dom.parentElement) {
			this.isAppended = true
		} else {
			this.isAppended = false
		}

		if (this.dom.getAttribute('data-ni')) {
			this.nodeID = Number(this.dom.getAttribute('data-ni'))
		} else {
			this.nodeID = null
		}

		if (this.type === "FIGURE") {
			this.textDom = this.dom.querySelector("FIGCAPTION")
		} else {
			this.textDom = this.dom
		}

		this.textContent = this.textDom.textContent
		// this.innerHTML = this.textDom.innerHTML

		// this.previousSibling = this.getPreviousSibling()
		// this.nextSibling = this.getNextSibling()

	}

	// Methods

	// is-

	/**
	 *
	 * @param {PVMNode} compareNode
	 */
	isEqualTo(compareNode)
	{
		return this.nodeID === compareNode.nodeID
	}

	// Setters

	setNodeID(nodeID)
	{
		this.nodeID = nodeID
		this.dom.setAttribute('data-ni', nodeID)
	}

	// Getters

	getPreviousSibling()
	{
		let previousElement = this.dom.previousElementSibling
		let pvmnd = null

		if (!previousElement) {

			if (
				this.dom.parentElement.nodeName.toUpperCase() === "UL" ||
				this.dom.parentElement.nodeName.toUpperCase() === "OL"
			) {
				previousElement = this.dom.parentElement.previousElementSibling
			} else {
				return null
			}

		}

		if (!previousElement) return null

		if (AN.all.includes(previousElement.nodeName)) {

			pvmnd = new PVMNode(previousElement)

		} else {

			if (
				previousElement.nodeName.toUpperCase() === "UL" ||
				previousElement.nodeName.toUpperCase() === "OL"
			) {

				let LIs = previousElement.querySelectorAll('li')
				let lastChildLI = LIs[LIs.length - 1]

				if (lastChildLI) {

					pvmnd = new PVMNode(lastChildLI)

				}

			}

		}


		return pvmnd
	}

	getNextSibling()
	{
		let nextElement = this.dom.nextElementSibling
		let pvmnd = null


		if (!nextElement) {

			if (
				this.dom.parentElement.nodeName === "UL" ||
				this.dom.parentElement.nodeName === "OL"
			) {
				nextElement = this.dom.parentElement.nextElementSibling
			} else {
				return null
			}

		}

		if (!nextElement) return null

		if (AN.all.includes(nextElement.nodeName)) {

			pvmnd = new PVMNode(nextElement)

		} else {

			if (
				nextElement.nodeName === "UL" ||
				nextElement.nodeName === "OL"
			) {

				let firstChildLI = nextElement.querySelector('li')

				if (firstChildLI) {

					pvmnd = new PVMNode(firstChildLI)

				}

			}

		}


		return pvmnd
	}

	/**
	* Get the first or last text node inside the HTMLElement
	* @param {String} direction
	* "first" | "last"
	*/
	getTextNodeInPVMNode(direction)
	{
		var travelNode = this.dom
		var returnNode = null

		if (direction === "first") {
			while (1) {
				if (travelNode === null) {
					break
				} else if (travelNode.nodeType === 3) {
					returnNode = travelNode
					break
				} else {
					travelNode = travelNode.firstChild
				}
			}
		} else if (direction === "last") {
			while (1) {
				if (travelNode === null) {
					break
				} else if (travelNode.nodeType === 3) {
					returnNode = travelNode
					break
				} else {
					travelNode = travelNode.lastChild
				}
			}
		} else {
			console.error("Second parameter must be 'first' or 'last'.")
		}

		return returnNode

	}

	// Actions

	/**
	 * Transfroms the node's tagName.
	 * @param {string} newTagName
	 */
	transformTo(newTagName)
	{
		let originalType = this.type
		if (originalType === newTagName) return
		let newNode = document.createElement(newTagName)
		newNode.setAttribute('data-ni', this.nodeID)
		let child
		if (AN.transformable.includes(this.type)) {
			while (child = this.dom.firstChild) {
				newNode.appendChild(child)
			}

			if (!this.isAppended) return // If the PVMNode is not in the editor, return.

			if (this.type === "LI") {

				let currentList = this.dom.parentElement

				let liArray = currentList.querySelectorAll("LI")
				if (liArray[liArray.length - 1] === this.dom) {
					currentList.removeChild(this.dom)
					currentList.parentElement.insertBefore(newNode, currentList.nextElementSibling)
				} else if (liArray[0] === this.dom) {
					currentList.removeChild(this.dom)
					currentList.parentElement.insertBefore(newNode, currentList)
				} else {
					let newList = document.createElement(currentList.nodeName)
					for (let i = liArray.length - 1; i >= 0; i--) {
						if (liArray[i] === this.dom) {
							break
						}
						newList.insertBefore(liArray[i], newList.firstElementChild)
					}
					currentList.removeChild(this.dom)
					currentList.parentElement.insertBefore(newList, currentList.nextElementSibling)
					currentList.parentElement.insertBefore(newNode, newList)
				}

				if (currentList.querySelectorAll("LI").length === 0) {
					currentList.parentElement.removeChild(currentList)
				}

			} else {
				this.dom.parentElement.replaceChild(newNode, this.dom)
			}

			// Change this PVMNode's dom data.
			this.dom = newNode

		} else {

			console.warn("Cannot transform this node.", this)

		}

	}

}
