import AN from "./config/availableNodes"

export default class PVMNode {

	/**
	 *
	 * @param {Element} node
	 */
	constructor(node, parentTag = null)
	{

		/**
		 * @type {number}
		 */
		this.nodeID = null
		/**
		 * @type {string}
		 */
		this.type = null
		/**
		 * @type {string}
		 */
		this.parentType = parentTag

		if (AN.all.includes(node.nodeName)) {
			this.dom = node
			if (node.nodeName === "li") {
				if (
					this.dom.parentElement &&
					(this.dom.parentElement.nodeName === "UL" ||
					this.dom.parentElement.nodeName === "OL")
				) {
					this.parentType = this.dom.parentElement.nodeName
				}
			} else if (node.nodeName === "FIGURE") {

				this.imageMeta = {
					src: "",
					size: "normal"
				}

				this.imageMeta.src = node.querySelector("img").src

				if (node.classList.contains("full")) {
					this.imageMeta.size = "full"
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
			console.warn("This node has no ID.", this.dom)
			this.nodeID = null
		}

		if (this.type === "FIGURE") {
			this.textDOM = this.dom.querySelector("FIGCAPTION")
		} else {
			this.textDOM = this.dom
		}

		this.textContent = this.textDOM.textContent
		if (this.type === "FIGURE") {
			this.innerHTML = this.dom.innerHTML
		} else {
			this.innerHTML = this.textDOM.innerHTML
		}

		// this.dom = this.getDOM()

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
		// this.dom.setAttribute('data-ni', nodeID)
	}

	/**
	 * 
	 * @param {string} html 
	 */
	setInnerHTML(html)
	{
		this.innerHTML = html
		this.textDOM.innerHTML = html
		this.getDOM().innerHTML = html
	}

	/**
	 * 
	 * @param {Element} dom 
	 */
	setDOM(dom)
	{
		this.dom = dom
	}

	// Getters

	getPreviousSibling()
	{
		let dom = this.getDOM()
		let previousElement = dom.previousElementSibling
		let pvmnd = null

		if (!previousElement) {

			if (
				dom.parentElement.nodeName.toUpperCase() === "UL" ||
				dom.parentElement.nodeName.toUpperCase() === "OL"
			) {
				previousElement = dom.parentElement.previousElementSibling
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
		let dom = this.getDOM()
		let nextElement = dom.nextElementSibling
		let pvmnd = null

		if (!nextElement) {

			if (
				dom.parentElement.nodeName === "UL" ||
				dom.parentElement.nodeName === "OL"
			) {
				nextElement = dom.parentElement.nextElementSibling
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

	getDOM()
	{

		let dom = document.querySelector('[data-ni="' + this.nodeID + '"]')
		if (!dom) {
			dom = document.createElement(this.type)
			dom.innerHTML = this.innerHTML
			dom.setAttribute("data-ni", this.nodeID)

			if (this.type === "FIGURE") {
				dom.classList.add("image")
				if (this.imageMeta.size === "full") {
					dom.classList.add("full")
				}
			}
		}

		this.dom = dom

		return dom

	}

	getTextDOM()
	{

		let textDOM = this.getDOM()

		if (this.type === "FIGURE") {
			textDOM = textDOM.querySelector("figcaption")
		}

		return textDOM

	}

	// Actions

	/**
	 * Transfroms the node's tagName.
	 * @param {string} newTagName
	 */
	transformTo(newTagName)
	{

		let originalType = this.type
		newTagName = newTagName.toUpperCase()

		if (originalType === newTagName) return
		let newNode = document.createElement(newTagName)
		newNode.setAttribute('data-ni', this.nodeID)
		let child
		if (AN.transformable.includes(this.type)) {

			while (child = this.dom.firstChild) {
				newNode.appendChild(child)
			}

			if (!this.isAppended) return // If the PVMNode is not in the editor, return.

			if (this.type === "li") {

				let currentList = this.dom.parentElement

				let liArray = currentList.querySelectorAll("li")
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

				if (currentList.querySelectorAll("li").length === 0) {
					currentList.parentElement.removeChild(currentList)
				}

			} else {

				this.dom.parentElement.replaceChild(newNode, this.dom)

				if (newTagName === 'LI') {
					let previous = this.getPreviousSibling(), next = this.getNextSibling()
					if (previous && next && previous.type === "li" && next.type === "li") {

					}
				}


			}

			// Change this PVMNode's data.
			this.dom = newNode
			this.type = newTagName

		} else {

			console.warn("Cannot transform this node.", this)

		}

	}

}