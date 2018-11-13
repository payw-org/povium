import UndoManager from "./UndoManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"
import PVMNode from "./PVMNode"
import {AT} from "./config/AvailableTypes"

export default class NodeManager {

	eventMan   : EventManager
	undoMan    : UndoManager
	selMan     : SelectionManager
	editSession: EditSession

	constructor() {

		this.eventMan = null
		this.undoMan = null
		this.selMan = null
		this.editSession = null

	}

	/**
	 * Insert child before the referenced child.
	 * If the referenced child is null, it appends child to last.
	 * @param {PVMNode} insertingChild
	 * @param {PVMNode} refChild
	 */
	insertChildBefore(insertingChild, refChild) {

		// If the refChild is null,
		// append it to the last.
		if (!refChild) {
			this.appendChild(insertingChild)
			return
		}

		let previousChild = refChild.previousSibling
		let refChildDOM   = refChild.element
		let refChildIndex = this.getChildIndex(refChild)

		let newChildDOM = insertingChild.element

		// Adds a node to JS storage
		this.editSession.nodeList.splice(refChildIndex, 0, insertingChild)
		if (this.editSession.nodeList[refChildIndex - 1]) {
			this.editSession.nodeList[refChildIndex - 1].nextSibling = insertingChild
			                          insertingChild.previousSibling = this.editSession.nodeList[refChildIndex - 1]
		}
		refChild.previousSibling   = insertingChild
		insertingChild.nextSibling = refChild

		// Updates view

		// Inserting node is a list item
		if (AT.isListItem(insertingChild.type)) {
			// Referenced node is a list item
			if (AT.isListItem(refChild.type)) {
				if (refChild.parentType === insertingChild.parentType) {
					if (previousChild && previousChild.type === "li" && previousChild.parentType === refChild.parentType) {
						this.mergeLists(previousChild.element.parentElement, refChild.element.parentElement)
					}
					refChild.element.parentElement.insertBefore(insertingChild.element, refChild.element)
				} else {
					let abc = this.splitListByItem(refChild.element.parentElement, refChild.element)
					if (previousChild && AT.isListItem(previousChild.type)) {
						if (previousChild.parentType === insertingChild.parentType) {
							previousChild.element.parentElement.insertBefore(insertingChild.element, previousChild.element.nextElementSibling)
						} else {
							let wrapper = document.createElement(insertingChild.parentType)
							wrapper.appendChild(insertingChild.element)
							abc.parentElement.insertBefore(wrapper, abc)
						}
					} else {
						let wrapper = document.createElement(insertingChild.parentType)
						wrapper.appendChild(insertingChild.element)
						abc.parentElement.insertBefore(wrapper, abc)
					}
				}
			} else {
				if (previousChild && AT.isListItem(previousChild.type)) {
					if (previousChild.parentType === insertingChild.parentType) {
						previousChild.element.parentElement.insertBefore(insertingChild.element, previousChild.element.nextElementSibling)
					} else {
						let wrapper = document.createElement(insertingChild.parentType)
						wrapper.appendChild(insertingChild.element)
						refChild.element.parentElement.insertBefore(wrapper, refChild.element)
					}
				} else {
					let wrapper = document.createElement(insertingChild.parentType)
					wrapper.appendChild(insertingChild.element)
					refChild.element.parentElement.insertBefore(wrapper, refChild.element)
				}
			}
		} else { // Inserting node is not a list item
			// Referenced node is a list item
			if (AT.isListItem(refChild.type)) {
				let abc = this.splitListByItem(refChild.element.parentElement, refChild.element)
				abc.parentElement.insertBefore(insertingChild.element, abc)
			} else {
				refChild.element.parentElement.insertBefore(insertingChild.element, refChild.element)
			}
		}

	}

	/**
	 * @param {PVMNode} child
	 */
	appendChild(child) {

		let nodeList = this.editSession.nodeList
		if (nodeList[nodeList.length - 1]) {
			nodeList[nodeList.length - 1].nextSibling = child
			         child.previousSibling            = nodeList[nodeList.length - 1]
		}
		child.isConnected = true
		nodeList.push(child)

		// Render dom
		if (child.type === "li") {
			let wrapper = document.createElement(child.parentType)
			wrapper.appendChild(child.element)
			this.editSession.editorBody.appendChild(wrapper)
			if (child.previousSibling && child.previousSibling.type === "li" && child.previousSibling.parentType === child.parentType) {
				this.mergeLists(child.previousSibling.element.parentElement, child.element.parentElement)
			}
		} else {
			this.editSession.editorBody.appendChild(child.element)
		}

	}

	/**
	 * Returns the node's index.
	 * @param {PVMNode} node
	 * @return {number}
	 */
	getChildIndex(node: PVMNode) {

		return this.editSession.nodeList.findIndex(function(element: PVMNode) {
			return element.isSameAs(node)
		})

	}

	/**
	 * @param {number} id
	 */
	getNodeByID(id: number) {

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
	 * @param {object=} options
	 * @param {string} options.parentType
	 * @param {string} options.html
	 * @param {string} options.url
	 * @param {string} options.mode
	 * @return {PVMNode}
	 */
	createNode(type, options?) {

		type = type.toLowerCase()

		if (
			type === "li" && options && !("parentType" in options) ||
			type === "li" && !options
		) {
			console.error(`"li" node must be created with parent tag.`)
			return
		}

		let newNode = new PVMNode()

		// Set an unique auto incremental node ID
		if (options && options.nodeID) {
			newNode.id = options.nodeID
		} else {
			newNode.id = ++this.editSession.lastNodeID
		}
		
		newNode.type = type
		if (options && "parentType" in options) {
			newNode.parentType = options.parentType
		}

		let dom

		if (AT.textOnly.includes(newNode.type)) {

			// Text nodes
			dom           = document.createElement(newNode.type)
			dom.innerHTML = "<br>"
			if (options && ("html" in options)) {
				dom.innerHTML = options.html
				if (options.html === "") {
					dom.innerHTML = "<br>"
				}
			}
			newNode.element     = dom
			newNode.textElement = dom

		} else if (newNode.type === "image") {

			// Image node
			dom = document.createElement("figure")
			dom.classList.add("image")
			if (options.size) {
				dom.classList.add(options.size)
			}
			let imgWrapper                 = document.createElement("div")
			    imgWrapper.className       = "image-wrapper"
			    imgWrapper.contentEditable = "false"
			let imgDOM                     = document.createElement("img")
			    imgDOM.src                 = options.url
			imgWrapper.appendChild(imgDOM)
			let captionDOM           = document.createElement("figcaption")
			    captionDOM.innerHTML = options.html
			if (options.html.length > 0) {
				dom.classList.add("caption-enabled")
			}
			dom.appendChild(imgWrapper)
			dom.appendChild(captionDOM)
			newNode.element     = dom
			newNode.textElement = captionDOM

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
	removeChild(node)
	{

		let index = this.getChildIndex(node)
		
		if (node.previousSibling) {
			node.previousSibling.nextSibling = node.nextSibling
		}

		if (node.nextSibling) {
			node.nextSibling.previousSibling = node.previousSibling
		}

		// Process the js object
		this.editSession.nodeList[index].previousSibling = null
		this.editSession.nodeList[index].nextSibling     = null
		this.editSession.nodeList.splice(index, 1)

		// Process the dom. (view)
		if (node.type === "li") {
			let list = node.element.parentElement
			list.removeChild(node.element)
			if (list.querySelectorAll("li").length === 0) {
				list.parentElement.removeChild(list)
			}
		} else {
			node.element.parentElement.removeChild(node.element)
		}

	}

	splitNode(newNodeID = null) {

		let range
		let currentNode  = this.selMan.getCurrentNode()
		let currentRange = this.selMan.getCurrentRange()

		let bugSolver = document.createTextNode(" ")
		currentNode.textElement.appendChild(bugSolver)

		let newRange = this.selMan.createRange(currentNode, currentRange.start.offset, currentNode, currentNode.getTextContent().length)

		this.selMan.setRange(newRange)

		range = window.getSelection().getRangeAt(0)

		let extractedContents = range.extractContents()

		let newNode = this.createNode(currentNode.type, {
			parentType: currentNode.parentType,
			nodeID    : newNodeID
		})
		let n
		newNode.textElement.innerHTML = ""
		while (n = extractedContents.firstChild) {
			newNode.textElement.appendChild(n)
		}

		window.getSelection().removeAllRanges()

		newNode.textElement.innerHTML = newNode.textElement.innerHTML.replace(/ $/g, "")
		this.insertChildBefore(newNode, currentNode.nextSibling)

		return newNode
		
	}

	/**
	 * @param {PVMNode} node1
	 * @param {PVMNode} node2
	 */
	mergeNodes(node1, node2) {

		if (!node1 || !node2) {
			return
		}

		this.normalize(node1.textElement)
		this.normalize(node2.textElement)

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
	splitListByIndex(listElm, index) {
		let itemCount = listElm.querySelectorAll("li").length
		if (index + 1 > itemCount) {
			console.error("The given index " + index + " is bigger than the list size.", listElm)
		}
	}

	/**
	 * Splits list and returns the new generated list element.
	 * If the splitting target is the first child,
	 * then it does nothing and returns given list element.
	 * @param {HTMLElement} listElm
	 * @param {HTMLElement} childItem
	 */
	splitListByItem(listElm, childItem) {
		let newList   = document.createElement(listElm.nodeName)
		let yesInsert = false

		let returnList = newList

		let items = listElm.querySelectorAll("li")
		for (let i = 0; i < items.length; i++) {
			if (items[i].isSameNode(childItem)) {
				yesInsert = true
				if (i === 0) {
					returnList = listElm
					break
				}
			}
			if (yesInsert) {
				newList.appendChild(items[i])
			}
		}
		if (newList.querySelectorAll("li").length > 0) {
			listElm.parentElement.insertBefore(newList, listElm.nextElementSibling)
		}

		return returnList
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

	normalize(element: HTMLElement) {
		let currentRange = this.selMan.getCurrentRange()
		while (1) {
			if (!element.innerHTML.match(/<\/(.)><\1 ?.*?>/gi)) {
				break
			} else {
				element.innerHTML = element.innerHTML.replace(/<\/(.)><\1 ?.*?>/gi, "")
			}
		}
		element.childNodes.forEach((child) => {
			if (child.textContent.length === 0) {
				child.parentNode.removeChild(child)
			}
		})

		if (element.textContent.length === 0) {
			element.appendChild(document.createElement("br"))
		}

		this.selMan.setRange(currentRange)
	}

	textNodesUnder(elm: HTMLElement) {

		let n,    a = []
		let walk = document.createTreeWalker(elm, NodeFilter.SHOW_TEXT, null, false)
		while (n = walk.nextNode()) {
			a.push(n)
		}
		return a

	}

	/**
	* Get the first or last text node inside the HTMLElement
	*/
	getTextNodeInElementNode(node: HTMLElement, firstOrLast: string)
	{
		var travelNode: ChildNode = node
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
	 *
	 * @param {PVMNode} node
	 * @param {string} newType
	 * @param {boolean} isRecording
	 * @param {string} newParentType
	 */
	transformNode(node, newType, newParentType = null)
	{
		// If the original node type and
		// the new type is same, do nothing.
		newType = newType.toLowerCase()
		if (node.type === newType && node.parentType === newParentType) return

		let oldElm = node.element

		let newElm = document.createElement(newType)

		let nextNode = node.nextSibling

		this.removeChild(node)

		this.copySoul(node.element, newElm)
		node.type       = newType
		node.parentType = newParentType
		node.replaceElement(newElm)

		if (newType === "li") {
			if (newParentType === "ol") {
				node.textElement.innerHTML = node.textElement.innerHTML.replace(/^(<.* ?.*?)?1. /, "$1")
				node.fixEmptiness()
			} else if (newParentType === "ul") {
				node.textElement.innerHTML = node.textElement.innerHTML.replace(/^(<.* ?.*?)?- /, "$1")
				node.fixEmptiness()
			}
		}

		this.insertChildBefore(node, nextNode)
		
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
