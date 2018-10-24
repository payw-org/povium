import UndoManager from "./UndoManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"
import PVMNode from "./PVMNode"
import AT from "./config/AvailableTypes"

export default class NodeManager {

	constructor() {

		/**
		 * @type {EventManager}
		 */
		this.eventMan = null
		/**
		 * @type {UndoManager}
		 */
		this.undoMan = null
		/**
		 * @type {SelectionManager}
		 */
		this.selMan = null
		/**
		 * @type {EditSession}
		 */
		this.editSession = null

	}

	/**
	 * Insert child before the referenced child.
	 * If the referenced child is null, it appends child to last.
	 * @param {PVMNode} insertingChild
	 * @param {PVMNode} refChild
	 */
	insertChildBefore(insertingChild, refChild) {

		if (!refChild) {
			this.appendChild(insertingChild)
			return
		}
		let previousChild = refChild.previousSibling
		let refChildDOM = refChild.element
		let refChildIndex = this.getChildIndex(refChild)

		let newChildDOM = insertingChild.element
		this.editSession.nodeList.splice(refChildIndex, 0, insertingChild)
		if (this.editSession.nodeList[refChildIndex - 1]) {
			this.editSession.nodeList[refChildIndex - 1].nextSibling = insertingChild
			insertingChild.previousSibling = this.editSession.nodeList[refChildIndex - 1]
		}
		refChild.previousSibling = insertingChild
		insertingChild.nextSibling = refChild


		this.editSession.editorBody.insertBefore(newChildDOM, refChildDOM)

	}

	/**
	 * @param {PVMNode} child
	 */
	appendChild(child) {

		let nodeList = this.editSession.nodeList
		if (nodeList[nodeList.length - 1]) {
			nodeList[nodeList.length - 1].nextSibling = child
			child.previousSibling = nodeList[nodeList.length - 1]
		}
		child.isConnected = true
		nodeList.push(child)

		// Render dom
		this.editSession.editorBody.appendChild(child.element)

	}

	/**
	 * Returns the node's index.
	 * @param {PVMNode} node
	 * @return {number}
	 */
	getChildIndex(node) {

		return this.editSession.nodeList.findIndex(function(element) {
			return element.isSameAs(node)
		})

	}

	/**
	 * @param {number} id
	 */
	getNodeByID(id) {

		return this.editSession.nodeList.find(function(element) {
			return element.id === id
		})

	}

	/**
	 * @param {Element} element
	 */
	getNodeID(element) {

		let id = Number(element.getAttribute("data-ni"))
		if (!id) {
			// error handler
			console.error("Can't get nodeID")
			return null
		} else {
			return id
		}

	}

	/**
	 * @param {Element} element 
	 * @param {number} id 
	 */
	setNodeID(element, id) {

		element.setAttribute("data-ni", id)

	}

	/**
	 * @param {string} type
	 * @param {object} options
	 * @param {string} options.parentType
	 * @param {string} options.html
	 * @param {string} options.src
	 * @param {string} options.mode
	 * @return {PVMNode}
	 */
	createNode(type, options) {

		if (
			type === "li" && options && !("parentType" in options) ||
			type === "li" && !options
		) {
			console.error(`"li" node must be created with parent tag.`)
			return
		}

		let newNode = new PVMNode()

		newNode.id = ++this.editSession.lastNodeID
		newNode.type = type
		if (options && "parentType" in options) {
			newNode.parentType = options.parentType
		}

		let dom

		if (AT.textContained.includes(newNode.type)) {
			dom = document.createElement(newNode.type)
			dom.innerHTML = "<br>"
			if (options && ("html" in options)) {
				dom.innerHTML = options.html
				if (options.html === "") {
					dom.innerHTML = "<br>"
				}
			}
			newNode.element = dom
			newNode.textElement = dom
		}

		dom.setAttribute("data-ni", newNode.id)

		return newNode

	}

	/**
	 * @return {PVMNode}
	 */
	getFirstChild()
	{
		return this.editSession.nodeList[0]
	}

	/**
	 * @return {PVMnode}
	 */
	getLastChild()
	{
		return this.editSession.nodeList[this.editSession.nodeList.length - 1]
	}

	/**
	* Removes the node from the editor.
	* @param {PVMNode} node
	* @param {object} recordData { beforeRange, afterRange }
	*/
	removeChild(node, recordData)
	{

		let index = this.getChildIndex(node)
		
		if (node.previousSibling) {
			node.previousSibling.nextSibling = node.nextSibling
		}

		if (node.nextSibling) {
			node.nextSibling.previousSibling = node.previousSibling
		}

		this.editSession.nodeList[index].previousSibling = null
		this.editSession.nodeList[index].nextSibling = null
		this.editSession.nodeList.splice(index, 1)

		this.editSession.editorBody.removeChild(node.element)

	}

	splitNode() {

		let range
		let currentNode = this.selMan.getCurrentNode()
		let currentRange = this.selMan.getCurrentRange()

		let bugSolver = document.createTextNode(" ")
		currentNode.textElement.appendChild(bugSolver)

		let newRange = this.selMan.createRange(currentNode, currentRange.start.offset, currentNode, currentNode.getTextContent().length)

		this.selMan.setRange(newRange)

		range = window.getSelection().getRangeAt(0)

		let extractedContents = range.extractContents()

		let newNode = this.createNode(currentNode.type, { parentType: currentNode.parentType })
		let n
		newNode.textElement.innerHTML = ""
		while (n = extractedContents.firstChild) {
			newNode.textElement.appendChild(n)
		}

		window.getSelection().removeAllRanges()

		newNode.textElement.innerHTML = newNode.textElement.innerHTML.replace(/ $/g, "")
		this.insertChildBefore(newNode, currentNode.nextSibling)

		newRange = this.selMan.createRange(newNode, 0, newNode, 0)
		this.selMan.setRange(newRange)
		
	}

	/**
	 * @param {PVMNode} node1
	 * @param {PVMNode} node2
	 */
	mergeNodes(node1, node2) {

		if (!node1 || !node2) {
			return
		}

		node1.textElement.innerHTML += node2.textElement.innerHTML
		// node1.textElement.normalize()
		this.normalize(node1.element)
		
		this.removeChild(node2)

	}

	/**
	 * Splits list from 0 ~ index, (index + 1) ~ last and returns new list elm.
	 * @param {HTMLElement} listElm
	 * @param {number} index
	 */
	splitList(listElm, index) {
		let itemCount = listElm.querySelectorAll("li").length
		if (index + 1 > itemCount) {
			console.error("The given index " + index + " is bigger than the list size.", listElm)
		}
	}

	/**
	 * Merges list1 and list2 into list1.
	 * @param {Element} list1
	 * @param {Element} list2
	 * @param {boolean} forceMerge
	 */
	mergeLists(list1, list2, forceMerge = false)
	{

		if (list1.nodeName !== list2.nodeName && !forceMerge) {
			return
		}

		let node
		while (node = list2.firstElementChild) {
			list1.appendChild(node)
		}

		list2.parentNode.removeChild(list2)

	}

	/**
	 * @param {HTMLElement} element
	 */
	normalize(element) {
		while (1) {
			if (!element.innerHTML.match(/<\/(.)><\1 ?.*?>/gi)) {
				break
			} else {
				element.innerHTML = element.innerHTML.replace(/<\/(.)><\1 ?.*?>/gi, "")
			}
		}
	}

	textNodesUnder(elm) {

		let n, a = []
		let walk = document.createTreeWalker(elm, NodeFilter.SHOW_TEXT, null, false)
		while (n = walk.nextNode()) {
			a.push(n)
		}
		return a

	}

	/**
	* Get the first or last text node inside the HTMLElement
	* @param {HTMLElement} node
	* @param {String} firstOrLast
	* "first" | "last"
	*/
	getTextNodeInElementNode(node, firstOrLast)
	{
		var travelNode = node
		var returnNode = null
		if (!node) {
			return null
		}

		if (firstOrLast === "first") {
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
		} else if (firstOrLast === "last") {
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

	/**
	* Splits text nodes based on the selection and
	* returns start and end node.
	* @return {Object.<Text>}
	*/
	splitTextNode()
	{
		var range = window.getSelection().getRangeAt(0)
		if (!range) {
			return
		}
		var startNode = range.startContainer
		var startOffset = range.startOffset

		var returnNode = {
			startNode: null,
			endNode: null
		}

		returnNode.startNode = startNode

		// Split start of the range.
		if (
			startNode.nodeType === 3 &&
			startOffset > 0 &&
			startOffset < startNode.textContent.length
		) {

			returnNode.startNode = startNode.splitText(startOffset)

		}

		range = window.getSelection().getRangeAt(0)
		var endNode = range.endContainer
		var endOffset = range.endOffset

		returnNode.endNode = endNode

		// Split end of the range.
		if (
			startNode !== endNode &&
			endNode.nodeType === 3 &&
			endOffset < endNode.textContent.length
		) {

			endNode.splitText(endOffset)

		}

		return returnNode

	}

	/**
	 *
	 * @param {PVMNode} node
	 * @param {string} newType
	 * @param {boolean} isRecording
	 * @param {string} newParentType
	 */
	transformNode(node, newType, isRecording = true, newParentType = null)
	{

		let oldElm = node.element

		let newElm = document.createElement(newType)
		this.copySoul(node.element, newElm)
		node.type = newType
		node.parentType = newParentType
		node.replaceElement(newElm)

		if (AT.isListItem(newType)) {
			let list = document.createElement(newParentType)
			list.appendChild(newElm)
			this.editSession.editorBody.replaceChild(list, oldElm)
		} else {
			this.editSession.editorBody.replaceChild(newElm, oldElm)
		}		
		
	}

	/**
	 * @param {HTMLElement} fromElm 
	 * @param {HTMLElement} toElm 
	 */
	copySoul(fromElm, toElm) {

		toElm.innerHTML = fromElm.innerHTML
		toElm.setAttribute("data-ni", this.getNodeID(fromElm))
		if (AT.alignable.includes(toElm.nodeName) && fromElm.style.textAlign) {
			toElm.style.textAlign = fromElm.style.textAlign
		}
		
	}

	convertToJSON() {

	}

}
