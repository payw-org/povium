import PVMEditSession from "./PVMEditSession"
import AN from "./config/availableNodes"
import PVMNode from "./PVMNode"
import PVMRange from "./PVMRange"

export default class PVMNodeManager {

	/**
	 * 
	 * @param {PVMEditSession} editSession 
	 */
	constructor(editSession)
	{
		this.session = editSession
		this.sel = editSession.selection
		this.undoMan = editSession.undoManager
	}

	// Methods

	// Actions

	/**
	* Creates a PVMNode with the given element.
	* @param {Element} dom 
	*/
	createNode(dom, parentTag = null)
	{
		if (!dom) return null

		let node = new PVMNode(dom, parentTag)
		if (!node.nodeID) {
			this.session.lastNodeID += 1
			node.setNodeID(this.session.lastNodeID)
		}
		return node
	}

	/**
	* 
	* @param {string} tag 
	*/
	createEmptyNode(tag, parentTag = null)
	{
		let dom = document.createElement(tag)
		dom.innerHTML = "<br>"
		let node = this.createNode(dom, parentTag)
		return node
	}

	getFirstChild()
	{
		return this.createNode(this.session.editorBody.firstElementChild)
	}

	getLastChild()
	{
		let lastElementChild = this.session.editorBody.lastElementChild
		if (!lastElementChild) {
			return null
		} else {
			if (
				lastElementChild.nodeName === 'UL' ||
				lastElementChild.nodeName === 'OL'
			) {
				let items = lastElementChild.querySelectorAll('li')
				return this.createNode(items[items.length - 1])
			} else {
				return this.createNode(this.session.editorBody.lastElementChild)
			}
		}
	}

	/**
	* Returns the pvmNode by the node ID.
	* @param {number} refNodeID 
	* @return {PVMNode}
	*/
	getNodeByID(refNodeID)
	{
		let dom = document.querySelector('[data-ni="' + refNodeID + '"]')
		if (!dom) {
			// Cannot find the dom
			// Throws the error
			console.warn("Cannot find the node.", refNodeID)
			return null
		}

		let pvmn = this.createNode(dom)
		return pvmn
	}


	/**
	* Removes the node from the editor.
	* @param {number} nodeID 
	* @param {object} recordData { beforeRange, afterRange }
	*/
	removeChild(nodeID, recordData)
	{

		let targetNode = this.getNodeByID(nodeID)

		if (!targetNode) return

		let previousNode = targetNode.getPreviousSibling()
		let nextNode = targetNode.getNextSibling()

		targetNode.isAppended = false

		if (targetNode.type === "li") {

			let parent = targetNode.dom.parentElement
			parent.removeChild(targetNode.dom)
			if (parent.querySelectorAll('li').length === 0) {
				parent.parentElement.removeChild(parent)
			}

			if (
				previousNode && nextNode &&
				previousNode.type === "li" && nextNode.type === "li" &&
				previousNode.parentType === nextNode.parentType &&
				!previousNode.dom.parentElement.isSameNode(nextNode.dom.parentElement)
			) {
				this.mergeLists(previousNode.dom.parentElement, nextNode.dom.parentElement)
			}

		} else {

			if (
				previousNode && nextNode &&
				previousNode.type === "li" && nextNode.type === "li" &&
				previousNode.parentType === nextNode.parentType
			) {
				this.mergeLists(previousNode.dom.parentElement, nextNode.dom.parentElement)
			}

			targetNode.dom.parentElement.removeChild(targetNode.dom)

		}


		if (!recordData) {
			console.warn("Node was removed without record.")
			return
		} else {
			this.undoMan.record({
				type: "remove",
				affectedNode: targetNode,
				affectedNodeID: targetNode.nodeID,
				nextNode: nextNode,
				before: {
					range: recordData.beforeRange
				},
				after: {
					range: recordData.afterRange
				}
			})
		}
		
	}

	/**
	* Appends the given node into the editor.
	* @param {PVMNode} node 
	* @param {object} recordData { beforeRange, afterRange, nextNode }
	*/
	appendChild(node, recordData)
	{

		if (node.type === "li") {
			let list = document.createElement(node.parentType)
			list.appendChild(node.dom)
			this.session.editorBody.appendChild(list)
		} else {
			this.session.editorBody.appendChild(node.dom)
		}

		if (recordData) {
			this.undoMan.record({
				type: 'insert',
				affectedNode: node,
				affectedNode: node.nodeID,
				nextNode: nextNode,
				nextNodeID: null,
				before: {
					range: recordData.beforeRange
				},
				after: {
					range: recordData.afterRange
				}
			})
		}

	}

	/**
	* Appends a pvmnode before the given node.
	* @param {PVMNode} insertingNode
	* @param {PVMNode} refNode 
	* @param {object} recordData { beforeRange, afterRange, nextNode }
	* @param {PVMRange} recordData.beforeRange
	* @param {PVMRange} recordData.afterRange
	* @param {PVMNode} recordData.nextNode
	*/
	insertChildBefore2(insertingNode, refNode, recordData)
	{
		let nextNode = refNode
		let previousNode = refNode.getPreviousSibling()
	}

	/**
	* Appends a pvmnode before the given node.
	* @param {PVMNode} insertingNode
	* @param {number} refNodeID 
	* @param {object} recordData { beforeRange, afterRange, nextNode }
	* @param {PVMRange} recordData.beforeRange
	* @param {PVMRange} recordData.afterRange
	* @param {PVMNode} recordData.nextNode
	*/
	insertChildBefore(insertingNode, refNodeID, recordData)
	{
		let next = this.getNodeByID(refNodeID)
		console.log(next)
		if (!next) {

			this.appendChild(insertingNode)

			return
		}
		let previous = next.getPreviousSibling()
		let previousDOM
		if (previous) {
			previousDOM = previous.getDOM()
		}
		let targetDOM = next.getDOM()
		let insertingDOM = insertingNode.getDOM()

		insertingNode.isAppended = true

		let tempNode

		if (insertingNode.type === "li") {

			if (next && next.type === "li") {

				if (next.parentType === insertingNode.parentType) {

					targetDOM.parentElement.insertBefore(insertingDOM, targetDOM)
				
				} else {

					let newList = document.createElement(insertingNode.parentType)
					newList.appendChild(insertingDOM)
					let list1 = targetDOM.parentElement
					let list2 = document.createElement(list1.nodeName)
					while (tempNode = list1.lastElementChild) {
						list2.appendChild(tempNode)
						if (tempNode.isSameNode(targetDOM)) {
							break
						}
					}
					list1.parentElement.insertBefore(list2, list1)
					if (list1.childElementCount === 0) {
						list1.parentElement.removeChild(list1)
					}
					list2.parentElement.insertBefore(newList, list2)

				}				

			} else {

				if (previous && previous.type === "li") {

					previousDOM.parentElement.insertBefore(insertingDOM, previousDOM.nextElementSibling)
				} else {
					let list = document.createElement(insertingNode.parentType)
					list.appendChild(insertingDOM)
					targetDOM.parentElement.insertBefore(list, targetDOM)
				}

			}
		} else {
			if (next.type === "li") {
				if (previous && previous.type === "li") {
					let originalList = targetDOM.parentElement
					let newList = document.createElement(originalList.nodeName)
					let tempNode
					while (tempNode = originalList.firstElementChild) {
						if (tempNode === targetDOM) break
						newList.appendChild(tempNode)
					}
					originalList.parentElement.insertBefore(newList, originalList)
					originalList.parentElement.insertBefore(insertingDOM, originalList)
				} else {
					targetDOM.parentElement.parentElement.insertBefore(insertingDOM, targetDOM.parentElement)
				}

			} else {
				targetDOM.parentElement.insertBefore(insertingDOM, targetDOM)
			}
		}

		if (recordData) {
			this.undoMan.record({
				type: 'insert',
				affectedNode: insertingNode,
				affectedNodeID: insertingNode.nodeID,
				nextNode: recordData.nextNode,
				nextNodeID: recordData.nextNode.nodeID,
				before: {
					range: recordData.beforeRange
				},
				after: {
					range: recordData.afterRange
				}
			})
		} else {
			console.info(`Inserted without recording.`)
		}

	}

	/**
	* Merge two nodes into a single node
	* @param {PVMNode} first
	* @param {PVMNode} second
	* @param {boolean} matchTopNode
	* @param {boolean} isRecording
	*/
	mergeNodes(first, second, matchTopNode = true, isRecording = true)
	{

		var front = first.getTextDOM(), back = second.getTextDOM()
		var tempNode
		var nextFront, nextBack

		let currentRange = this.sel.getCurrentRange()

		var range = window.getSelection().getRangeAt(0)
		var startNode = first.getTextNodeInPVMNode("last")
		var startOffset
		if (startNode) {
			startOffset = startNode.textContent.length
		} else {
			startNode = second.getTextNodeInPVMNode("first")
			if (startNode) {
				startOffset = 0
			}
		}

		let removedNode, removedNodePreviousNode, removedNodeNextNode

		while (1) {

			// console.log(front.cloneNode(true), back.cloneNode(true))

			if (!front || !back) {
				break
			}

			if (front.nodeName !== back.nodeName) {
				if (
					front === first.textDOM &&
					back === second.textDOM &&
					matchTopNode
				) {

				} else {
					break
				}

			}

			if (front.nodeType === 3) {

				front.textContent += back.textContent
				back.parentNode.removeChild(back)

				break

			} else {

				nextFront = front.lastChild
				nextBack = back.firstChild

				while (tempNode = back.firstChild) {
					front.appendChild(tempNode)
				}

				// this.removeNode(back)
				let parentNode = back.parentNode
				if (back.nodeName === "li" && parentNode.querySelectorAll("li").length === 1) {

					removedNode = parentNode
					removedNodePreviousNode = parentNode.previousSibling
					removedNodeNextNode = parentNode.nextSibling

					parentNode.parentNode.removeChild(parentNode)

				} else {

					removedNode = back
					removedNodePreviousNode = back.previousSibling
					removedNodeNextNode = back.nextSibling

					back.parentNode.removeChild(back)

				}

				front = nextFront
				back = nextBack

			}

		}

		if (startNode) {

			var keepRange = document.createRange()
			keepRange.setStart(startNode, startOffset)
			keepRange.setEnd(startNode, startOffset)
			// this.replaceRange(keepRange)
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(keepRange)

		}

		if (!isRecording) return

		this.undoMan.record({
			type: "merge",
			affectedNode: first,
			mergedNodes: [
				first, second
			],
			before: {
				range: currentRange
			},
			after: {
				range: this.sel.getCurrentRange()
			}
		})

		this.sel.onSelectionChanged()


	}

	/**
	 * 
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
	 * 
	 * @param {number} newNodeID 
	 * @param {boolean} isRecording 
	 */
	splitElementNode3(newNodeID, isRecording = true)
	{

		let orgRange = window.getSelection().getRangeAt(0)
		let startNode = orgRange.startContainer

		let currentNode = this.sel.getCurrentTextNode()
		let currentParentNode = currentNode.textDOM

		let currentRange = this.sel.getCurrentRange()

		let originalContent = currentParentNode.innerHTML
		let originalTextLength = currentParentNode.textContent.length

		let travelNode = startNode

		let frontNode, backNode

		// Textnode

		while (1) {

			if (AN.textContained.includes(travelNode.nodeName)) {
				break
			} else if (travelNode.nodeType === 3) {

				if (orgRange.startOffset === 0) {

					if (travelNode.previousSibling) {

						frontNode = travelNode.previousSibling
						backNode = travelNode

					} else if (travelNode.parentNode) {

						travelNode = travelNode.parentNode

						continue

					}

				} else if (orgRange.startOffset < travelNode.textContent.length) {

					this.splitTextNode()

					frontNode = travelNode
					backNode = travelNode.nextSibling

				} else {

					if (travelNode.nextSibling) {

						frontNode = travelNode
						backNode = travelNode.nextSibling

					} else if (travelNode.parentNode) {

						travelNode = travelNode.parentNode

						continue

					}

				}

			} else if (frontNode === undefined && backNode === undefined) {

				if (orgRange.startOffset === 0) {

					if (travelNode.previousSibling) {

						frontNode = travelNode.previousSibling
						backNode = travelNode

					} else if (travelNode.parentNode) {

						travelNode = travelNode.parentNode
						continue

					}


				} else if (orgRange.startOffset > 0) {

					if (travelNode.nextSibling) {

						frontNode = travelNode
						backNode = travelNode.nextSibling

					} else if (travelNode.parentNode) {

						travelNode = travelNode.parentNode

						continue

					}

				}

			}

			travelNode = frontNode


			var newNode = document.createElement(travelNode.parentNode.nodeName)
			if (AN.textContained.includes(travelNode.parentNode.nodeName)) {
				newNode.setAttribute('data-ni', ++this.session.lastNodeID)
			}

			if (newNodeID) {
				newNode.setAttribute("data-ni", newNodeID)
			}


			var tempNode = backNode
			var nextNode

			// console.log("front: ", frontNode, " back: ", backNode, " newNode: ", newNode)

			while(1) {

				if (!tempNode) {
					break
				}

				nextNode = tempNode.nextSibling

				newNode.appendChild(tempNode)

				tempNode = nextNode

			}

			travelNode.parentNode.parentNode.insertBefore(newNode, travelNode.parentNode.nextSibling)
			var newRange = document.createRange()
			newRange.setStart(this.getTextNodeInElementNode(newNode, "first"), 0)
			newRange.collapse(true)
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(newRange)

			frontNode = frontNode.parentNode
			backNode = backNode.parentNode

			travelNode = travelNode.parentNode

		}

		if (!isRecording) return

		this.undoMan.record({
			type: "split",
			affectedNode: currentNode,
			before: {
				range: currentRange
			},
			after: {
				range: this.sel.getCurrentRange()
			}
		})


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
	 * @param {string} newTag 
	 */
	transformNode(node, newTag, isRecording = true, newParentType = null)
	{

		let currentRange = this.sel.getCurrentRange()
		let originalType = node.type
		let originalParentType = node.parentType
		let originalDOM = node.getDOM()
		newTag = newTag.toUpperCase()


		if (originalType === newTag) return
		if (!AN.transformable.includes(node.type)) return
		if (!node.isAppended) return

		let previousNode = node.getPreviousSibling()
		let nextNode = node.getNextSibling()

		let newNode = document.createElement(newTag), child
		newNode.setAttribute('data-ni', node.nodeID)
		
		while (child = originalDOM.firstChild) {
			newNode.appendChild(child)
		}

		if (node.type === "li") {

			let currentList = originalDOM.parentElement

			let liArray = currentList.querySelectorAll("li")

			if (liArray[liArray.length - 1] === originalDOM) {
				currentList.removeChild(originalDOM)
				currentList.parentElement.insertBefore(newNode, currentList.nextElementSibling)
			} else if (liArray[0] === originalDOM) {
				currentList.removeChild(originalDOM)
				currentList.parentElement.insertBefore(newNode, currentList)
			} else {
				let newList = document.createElement(currentList.nodeName)
				for (let i = liArray.length - 1; i >= 0; i--) {
					if (liArray[i] === originalDOM) {
						break
					}
					newList.insertBefore(liArray[i], newList.firstElementChild)
				}
				currentList.removeChild(originalDOM)
				currentList.parentElement.insertBefore(newList, currentList.nextElementSibling)
				currentList.parentElement.insertBefore(newNode, newList)
			}

			if (currentList.querySelectorAll("li").length === 0) {
				currentList.parentElement.removeChild(currentList)
			}

		} else {

			originalDOM.parentElement.replaceChild(newNode, originalDOM)

			node.type = newTag
			node.parentType = newParentType

			if (newTag === 'LI') {
				let id = null
				if (node.getNextSibling()) {
					id = node.getNextSibling().nodeID
				}
				this.removeChild(node.nodeID)
				this.insertChildBefore(node, id)
			}

		}

		node.type = newTag


		if (!isRecording) return

		this.undoMan.record({
			type: 'transform',
			affectedNode: node,
			affectedNodeID: node.nodeID,
			before: {
				range: currentRange,
				type: originalType,
				parentType: originalParentType
			},
			after: {
				range: currentRange,
				type: newTag,
				parentType: newParentType
			}
		})
	}

}