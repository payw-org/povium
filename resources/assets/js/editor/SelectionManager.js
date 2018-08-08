import DOMManager from "./DOMManager"
import UndoManager from "./UndoManager"
import PRange from "./PRange"

export default class SelectionManager
{

	/**
	 *
	 * @param {DOMManager} domManager
	 * @param {UndoManager} undoManager
	 */
	constructor(domManager, undoManager)
	{

		this.domManager = domManager
		this.undoManager = undoManager

	}

	// Events



	// Methods

	/**
	 * Align the selected paragraph.
	 * @param {String} direction
	 * Left, Center, Right
	 */
	align(direction)
	{

		// document.execCommand('styleWithCSS', true)
		// document.execCommand(direction, false)

		let chunks = this.getAllNodesInSelection()
		let node

		let range = window.getSelection().getRangeAt(0)

		let pRange = new PRange()
		let startParentNode = this.getNodeOfNode(range.startContainer)
		let startTextOffset = pRange.getTextOffset(startParentNode, range.startContainer, range.startOffset)
		let endParentNode = this.getNodeOfNode(range.endContainer)
		let endTextOffset = pRange.getTextOffset(endParentNode, range.endContainer, range.endOffset)

		// Record action
		let action = {
			type: "align",
			nodes: [],
			pRange: {
				startNode: startParentNode,
				startTextOffset: startTextOffset,
				endNode: endParentNode,
				endTextOffset: endTextOffset
			}
		}

		for (let i = 0; i < chunks.length; i++) {

			if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
				console.warn('The node is not a paragraph nor a heading.')
				continue
			}

			action.nodes.push({
				target: chunks[i],
				previousState: chunks[i].style.textAlign,
				nextState: direction
			})
			chunks[i].style.textAlign = direction

		}

		this.undoManager.recordAction(action)

	}


	styleText(tagName)
	{
		console.log(this.splitTextNode())
		let tag = document.createElement(tagName)

		// tag
	}

	/**
	 * Make the selection bold.
	 */
	bold()
	{
		// console.log(document.execCommand('bold', false))
		// this.itmotnTT("strong")
		this.styleText("strong")
	}

	/**
	 * Make the selection italics.
	 */
	italic()
	{
		document.execCommand('italic', false)
	}

	underline()
	{
		document.execCommand('underline', false)
	}

	strike()
	{
		document.execCommand('strikeThrough', false)
	}

	/**
	 *
	 * @param {string} type
	 */
	heading(type)
	{

		// # 버그
		// 엔터 치고 첫번째 줄과 두번째 빈 줄 셀렉트 하고
		// heading 적용 시 range 유지 안됨. range가 document 벗어났다고 에러뜸.
		// -> 빈 태그는 heading 적용하지 않음.

		let orgRange = this.getRange()
		if (!orgRange) {
			return
		}

		let startNode = orgRange.startContainer
		let startOffset = orgRange.startOffset
		let endNode = orgRange.endContainer
		let endOffset = orgRange.endOffset
		let chunks = this.getAllNodesInSelection()

		// record action
		let pRange = new PRange()
		let previousStartNode = this.getNodeOfNode(startNode)
		let startTextOffset = pRange.getTextOffset(previousStartNode, startNode, startOffset)
		let previousEndNode = this.getNodeOfNode(endNode)
		let endTextOffset = pRange.getTextOffset(previousEndNode, endNode, endOffset)

		let action = {
			type: "change",
			targets: [],
			range: {
				startTextOffset: startTextOffset,
				endTextOffset: endTextOffset
			}
		}

		this.undoManager.recordAction(action)

		// Change nodes
		for (var i = 0; i < chunks.length; i++) {

			if (
				!this.isParagraph(chunks[i]) &&
				!this.isHeading(chunks[i])
			) {
				console.warn('The node is not a paragraph nor a heading.')
				continue
			}

			if (chunks[i].nodeName === type) {
				type = "P"
			}

			var changedNode = this.changeNodeName(chunks[i], type, true, false)

			action.targets.push({
				previousTarget: chunks[i],
				nextTarget: changedNode
			})


			if (chunks[i] === startNode) {
				startNode = changedNode
			}
			if (chunks[i] === endNode) {
				endNode = changedNode
			}

		}




		var keepRange = document.createRange()
		keepRange.setStart(startNode, startOffset)
		keepRange.setEnd(endNode, endOffset)
		this.replaceRange(keepRange)

	}

	/**
	 *
	 * @param {string} type
	 */
	list(type)
	{

		// If one or more lists are
		// included in the selection,
		// add other chunks to the existing list.

		// If all selection is already a list
		// restore them to 'P' node.

		let orgRange = this.getRange()
		if (!orgRange) {
			return
		}

		if (type === undefined) {
			console.error("List type undefined.")
		}

		let startNode = orgRange.startContainer
		let startOffset = orgRange.startOffset
		let endNode = orgRange.endContainer
		let endOffset = orgRange.endOffset

		// Multiple range - Experimental
		endNode = window.getSelection().getRangeAt(window.getSelection().rangeCount - 1).endContainer
		endOffset = window.getSelection().getRangeAt(window.getSelection().rangeCount - 1).endOffset

		let chunks = this.getAllNodesInSelection()
		let listElm = document.createElement(type)
		var placedListElm = false
		var placedListElmIndex
		var node

		var unlockList = true
		var recordList = []

		for (var i = 0; i < chunks.length; i++) {

			// if (chunks[i].textContent === "") {
			// 	continue
			// }

			if (
				this.isParagraph(chunks[i])
			) {

				var itemElm = document.createElement('LI')

				while (node = chunks[i].firstChild) {

					itemElm.appendChild(node)

				}

				if (chunks[i] === startNode) {
					startNode = itemElm
				}

				if (chunks[i] === endNode) {
					endNode = itemElm
				}

				listElm.appendChild(itemElm)

				if (!placedListElm) {
					placedListElmIndex = i
					placedListElm = true
				} else {
					chunks[i].parentNode.removeChild(chunks[i])
				}

				unlockList = false

			} else if (this.isList(chunks[i])) {

				// If the node is already a list
				// move items inside to the new list element.

				if (!recordList.includes(chunks[i])) {
					recordList.push(chunks[i])
				}

				if (recordList.length > 1) {
					unlockList = false
				}

				while (node = chunks[i].firstChild) {

					listElm.appendChild(node)

				}


				if (!placedListElm) {
					placedListElmIndex = i
					placedListElm = true
				} else {
					chunks[i].parentNode.removeChild(chunks[i])
				}

			}

		}

		if (listElm.childElementCount < 1) {
			return
		}

		// this.getRange().insertNode(listElm)
		chunks[0].parentNode.replaceChild(listElm, chunks[placedListElmIndex])

		if (unlockList) {

			var range = document.createRange()
			var itemNode, nextNode
			var part1 = true, part2 = false, part3 = false
			var part1ListElm = document.createElement(type), part3ListElm = document.createElement(type)
			var part1ListElmInserted = false, part3ListElmInserted = false
			var part3Will = false

			range.setStartAfter(listElm)
			this.replaceRange(range)

			itemNode = listElm.firstChild
			nextNode = itemNode

			while (itemNode) {

				nextNode = itemNode.nextElementSibling

				if (itemNode.nodeName !== "LI") {
					itemNode = itemNode.nextElementSibling
					continue
				}

				if (itemNode.contains(startNode)) {
					part1 = false
					part2 = true
					part3 = false
				}

				if (itemNode.contains(endNode)) {
					part3Will = true
				}





				if (part1) {

					part1ListElm.appendChild(itemNode)

					if (!part1ListElmInserted) {
						range.insertNode(part1ListElm)
						range.setStartAfter(part1ListElm)
						part1ListElmInserted = true
					}

				} else if (part2) {

					var pElm = document.createElement('P')
					while (node = itemNode.firstChild) {
						pElm.appendChild(node)
					}

					range.insertNode(pElm)
					range.setStartAfter(pElm)

				} else if (part3) {

					part3ListElm.appendChild(itemNode)

					if (!part3ListElmInserted) {
						range.insertNode(part3ListElm)
						range.setStartAfter(part3ListElm)
						part3ListElmInserted = true
					}

				}

				if (itemNode === startNode) {
					startNode = pElm
				}

				if (itemNode === endNode) {
					endNode = pElm
				}



				if (part3Will) {
					part1 = false
					part2 = false
					part3 = true
				}

				itemNode = nextNode


			}

			if (this.domManager.editor.contains(listElm)) {
				this.domManager.editor.removeChild(listElm)
			}


		}

		var keepRange = document.createRange()
		keepRange.setStart(startNode, startOffset)
		keepRange.setEnd(endNode, endOffset)

		this.replaceRange(keepRange)

		this.fixSelection()

	}

	link(url)
	{
		var range = this.getRange()
		if (!range) {
			return
		}

		// if (range.collapsed) {
		// 	return
		// }

		document.execCommand('createLink', false, url)
		document.getSelection().removeAllRanges()

		this.domManager.hidePopTool()

	}

	unlink(linkNode) {
		var node
		var tempRange = document.createRange()
		tempRange.setStartAfter(linkNode)
		console.log("link is already set")
		while (node = linkNode.firstChild) {
			tempRange.insertNode(node)
			tempRange.setStartAfter(node)
		}
		linkNode.parentNode.removeChild(linkNode)
		document.getSelection().removeAllRanges()
	}

	blockquote()
	{
		let orgRange = this.getRange()
		if (!orgRange) {
			return
		}

		let startNode = orgRange.startContainer
		let startOffset = orgRange.startOffset
		let endNode = orgRange.endContainer
		let endOffset = orgRange.endOffset
		let chunks = this.getAllNodesInSelection()

		// record action
		let pRange = new PRange()
		let previousStartNode = this.getNodeOfNode(startNode)
		let startTextOffset = pRange.getTextOffset(previousStartNode, startNode, startOffset)
		let previousEndNode = this.getNodeOfNode(endNode)
		let endTextOffset = pRange.getTextOffset(previousEndNode, endNode, endOffset)

		let action = {
			type: "change",
			targets: [],
			range: {
				startTextOffset: startTextOffset,
				endTextOffset: endTextOffset
			}
		}

		this.undoManager.recordAction(action)

		var isAllBlockquote = true

		for (var i = 0; i < chunks.length; i++) {

			if (chunks[i].nodeName === "BLOCKQUOTE") {
				continue
			} else {
				isAllBlockquote = false
			}

			// if (chunks[i].textContent === "") {
			// 	continue
			// }

			if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
				console.warn('The node is not a paragraph nor a heading.')
				continue
			}

			var changedNode = this.changeNodeName(chunks[i], "blockquote", false, false)

			action.targets.push({
				previousTarget: chunks[i],
				nextTarget: changedNode
			})

			if (chunks[i] === startNode) {
				startNode = changedNode
			}
			if (chunks[i] === endNode) {
				endNode = changedNode
			}

		}

		// Selection is all blockquote
		if (isAllBlockquote) {
			for (var i = 0; i < chunks.length; i++) {

				var changedNode = this.changeNodeName(chunks[i], "P", false, false)

				action.targets.push({
					previousTarget: chunks[i],
					nextTarget: changedNode
				})

				if (chunks[i] === startNode) {
					startNode = changedNode
				}
				if (chunks[i] === endNode) {
					endNode = changedNode
				}
			}
		}


		var keepRange = document.createRange()
		keepRange.setStart(startNode, startOffset)
		keepRange.setEnd(endNode, endOffset)
		this.replaceRange(keepRange)
	}


	/**
	 * Backspace implementation
	 */
	backspace(e)
	{

		// Get current available node
		var currentNode = this.getNodeInSelection()

		var range = this.getRange()

		let linkedAction = false

		if (!range.collapsed) {
			console.log("pressed backspace but the range is not collapsed")
			e.stopPropagation()
			e.preventDefault()

			linkedAction = true

			if (!this.removeSelection("backspace", linkedAction)) {
				return;
			}

			// return
		}

		currentNode = this.getNodeInSelection()

		// Backspace key - Empty node
		if (currentNode && this.isTextEmptyNode(currentNode)) {

			e.stopPropagation()
			e.preventDefault()

			if (
				(this.isAvailableChildNode(currentNode) ||
				this.isAvailableParentNode(currentNode)) &&
				this.getPreviousAvailableNode(currentNode)
			) {

				// There is an available node before the current node

				var previousNode = this.getPreviousAvailableNode(currentNode)

				console.log("empty child node or parent node")

				if (this.isTextEmptyNode(previousNode)) {

					this.removeNode(previousNode, {
						previousState: {
							startNode: currentNode,
							startTextOffset: 0,
							endNode: currentNode,
							endTextOffset: 0
						},
						nextState: {
							startNode: currentNode,
							startTextOffset: 0,
							endNode: currentNode,
							endTextOffset: 0
						}
					}, linkedAction)

				} else {

					this.setCursorAt(previousNode, -1)

					this.removeNode(currentNode, {
						previousState: {
							startNode: currentNode,
							startTextOffset: 0,
							endNode: currentNode,
							endTextOffset: 0
						},
						nextState: {
							startNode: previousNode,
							startTextOffset: previousNode.textContent.length,
							endNode: previousNode,
							endTextOffset: previousNode.textContent.length
						}
					}, linkedAction)

				}

			} else {

				if (this.isListItem(currentNode)) {
					this.list(currentNode.parentNode.nodeName)
				} else if (
					this.isAvailableParentNode(currentNode) &&
					!this.isParagraph(currentNode)
				) {
					let changedNode = this.changeNodeName(currentNode, "P")
					this.setCursorAt(changedNode)
				}

			}

		} else if (currentNode && this.getSelectionPositionInParagraph() === 1) {

			// backspace - caret position at start of the node

			e.stopPropagation()
			e.preventDefault()

			if (
				(this.isAvailableChildNode(currentNode) ||
				this.isAvailableParentNode(currentNode)) &&
				this.getPreviousAvailableNode(currentNode)
			) {

				console.info("Available node exists")
				console.info("move this line to previous line")

				var previousNode = this.getPreviousAvailableNode(currentNode)

				if (this.isTextEmptyNode(previousNode)) {

					this.removeNode(previousNode, {
						previousState: {
							startNode: currentNode,
							startTextOffset: 0,
							endNode: currentNode,
							endTextOffset: 0
						},
						nextState: {
							startNode: currentNode,
							startTextOffset: 0,
							endNode: currentNode,
							endTextOffset: 0
						}
					}, linkedAction)

				} else {


					var node, orgRange = this.getRange()

					var startNode = orgRange.startContainer, startOffset = orgRange.startOffset
					var endNode = orgRange.endContainer, endOffset = orgRange.endOffset

					var br = previousNode.querySelector("br")

					if (br) {
						br.parentNode.removeChild(br)
					}

					this.mergeNodes(previousNode, currentNode, true, {
						previousState: {
							startNode: currentNode,
							startTextOffset: 0,
							endNode: currentNode,
							endTextOffset: 0
						},
						nextState: {
							startNode: previousNode,
							startTextOffset: previousNode.textContent.length,
							endNode: previousNode,
							endTextOffset: previousNode.textContent.length
						}
					}, linkedAction)

				}

			} else {

				// cursor at the start of the node
				// and no available node before current node.
				// do nothing

				console.info("No available node before current node")

			}

		}


	}

	delete(e)
	{
		// Get current available node
		var currentNode = this.getNodeInSelection()

		var range = this.getRange()

		let linkedAction = false

		if (!range.collapsed) {
			e.stopPropagation()
			e.preventDefault()

			linkedAction = true

			if (!this.removeSelection("delete", linkedAction)) {
				return;
			}
			// return
		}

		currentNode = this.getNodeInSelection()

		// Delete key - Empty node
		if (currentNode && this.isTextEmptyNode(currentNode)) {

			e.stopPropagation()
			e.preventDefault()

			if (
				(this.isAvailableChildNode(currentNode) ||
				this.isAvailableParentNode(currentNode)) &&
				this.getNextAvailableNode(currentNode)
			) {

				var nextNode = this.getNextAvailableNode(currentNode)

				console.log("empty child node or parent node")

				this.removeNode(currentNode)

				this.setCursorAt(nextNode, 0)

			} else {
				// do nothing
			}

		} else if (currentNode && this.getSelectionPositionInParagraph() === 3) {

			// Delete key - caret position at the end of the node
			e.stopPropagation()
			e.preventDefault()
			console.log("pull the next node to current.")

			if (
				(this.isAvailableChildNode(currentNode) ||
				this.isAvailableParentNode(currentNode)) &&
				this.getNextAvailableNode(currentNode)
			) {

				var nextNode = this.getNextAvailableNode(currentNode)

				if (nextNode) {

					if (this.isTextEmptyNode(nextNode)) {

						this.removeNode(nextNode, {
							previousState: {
								startNode: currentNode,
								startTextOffset: currentNode.textContent.length,
								endNode: currentNode,
								endTextOffset: currentNode.textContent.length
							},
							nextState: {
								startNode: currentNode,
								startTextOffset: currentNode.textContent.length,
								endNode: currentNode,
								endTextOffset: currentNode.textContent.length
							}
						}, linkedAction)

					} else {

						var br = nextNode.querySelector("br")
						if (br) {
							br.parentNode.removeChild(br)
						}

						this.mergeNodes(currentNode, nextNode, true, {
							previousState: {
								startNode: currentNode,
								startTextOffset: currentNode.textContent.length,
								endNode: currentNode,
								endTextOffset: currentNode.textContent.length
							},
							nextState: {
								startNode: currentNode,
								startTextOffset: currentNode.textContent.length,
								endNode: currentNode,
								endTextOffset: currentNode.textContent.length
							}
						}, linkedAction)

					}

				}

			}

		}
	}


	/**
	 * Prevents default action and implements a return(enter) key press.
	 */
	enter(e)
	{


		// When press return key

		var currentNode = this.getNodeInSelection()
		var range = this.getRange()
		let linkedAction = false

		if (!range.collapsed) {

			e.stopPropagation()
			e.preventDefault()

			linkedAction = true

			if (!this.removeSelection("enter", linkedAction)) {
				return
			}
			// return

		}

		// Delete the br if the current sentence is not empty
		currentNode = this.getNodeInSelection()

		if (currentNode && currentNode.textContent !== "" && currentNode.querySelector("br")) {

			currentNode.removeChild(currentNode.querySelector("br"))

		}

		// Ignore figcaption enter
		if (this.isImageCaption(currentNode)) {

			e.stopPropagation()
			e.preventDefault()
			return

		}

		var selPosType = this.getSelectionPositionInParagraph()

		e.stopPropagation()
		e.preventDefault()

		if (selPosType === 2) {

			console.info('Press enter: middle')
			this.splitElementNode3(linkedAction)

		} else if (selPosType === 1) {

			console.info('Press enter: start')
			var pElm = this.domManager.generateEmptyNode(currentNode.nodeName)

			currentNode.parentNode.insertBefore(pElm, currentNode)

			// Record action
			var action = {
				type: "add",
				nextSibling: currentNode,
				newNode: pElm,
				linked: linkedAction
			}
			this.undoManager.recordAction(action)

		} else if (selPosType === 3) {

			console.info('Press enter: end')
			var newNodeName = currentNode.nodeName
			var parentNode = currentNode.parentNode
			var nextNode = currentNode.nextSibling

			if (
				this.isBlockquote(currentNode) ||
				this.isHeading(currentNode)
			) {

				newNodeName = "P"

			} else if (this.isListItem(currentNode)) {
				if (this.isEmptyNode(currentNode)) {

					this.list(currentNode.parentNode.nodeName)
					return

				}

			}

			var pElm = this.domManager.generateEmptyNode(newNodeName)

			parentNode.insertBefore(pElm, nextNode)

			// Record action
			var action = {
				type: "add",
				previousSibling: currentNode,
				newNode: pElm,
				linked: linkedAction
			}
			this.undoManager.recordAction(action)



			var range = document.createRange()
			range.setStartBefore(pElm.firstChild)
			range.collapse(true)

			this.replaceRange(range)

		}


	}



	clearRange()
	{
		document.getSelection().removeAllRanges()
	}

	/**
	 *
	 * @param {Range} range
	 */
	replaceRange(range)
	{
		if (!range) {
			console.warn("range is not available.", range)
			return
		}
		document.getSelection().removeAllRanges()
		document.getSelection().addRange(range)
	}

	/**
	 * Replace the node if the node is inside the editor,
	 * else return the new node.
	 * @param {HTMLElement} targetNode An HTML element you want to change its node name.
	 * @param {String} newNodeName New node name for the target element.
	 */
	changeNodeName(targetNode, newNodeName, keepStyle = true, recordAction = true)
	{

		// Move all the nodes inside the target node
		// to the new generated node with new node name,
		// as well as preserving the range
		// if the startContainer or the endContainer are included
		// in the original node.

		if (targetNode.nodeType !== 1) {
			// If the node is not an HTML element do nothing.
			return
		}

		let startTextOffset = 0
		let endTextOffset = 0

		// 0. record action
		if (recordAction) {

			let range = window.getSelection().getRangeAt(0)
			let pRange = new PRange()
			startTextOffset = pRange.getTextOffset(this.getNodeOfNode(range.startContainer), range.startContainer, range.startOffset)
			endTextOffset = pRange.getTextOffset(this.getNodeOfNode(range.endContainer), range.endContainer, range.endOffset)

		}


		// 1. Change node
		var node
		var newNode = document.createElement(newNodeName)

		if (keepStyle) {
			newNode.style.textAlign = targetNode.style.textAlign
		}


		while (node = targetNode.firstChild) {
			newNode.appendChild(node)
		}

		// 3. replace node
		targetNode.parentNode.replaceChild(newNode, targetNode)



		if (recordAction) {
			let action = {
				type: "change",
				targets: [
					{
						previousTarget: targetNode,
						nextTarget: newNode
					}
				],
				range: {
					startTextOffset: startTextOffset,
					endTextOffset: endTextOffset
				}
			}
			this.undoManager.recordAction(action)
		}

		return newNode

	}

	/**
	 * Update selection information.
	 */
	updateSelection()
	{


	}

	fixSelection()
	{

		// If the selection is not in the available elements
		// adjust it.
		var range = this.getRange()
		if (!range) {
			return
		}


		for (var i = 0; i < window.getSelection().rangeCount; i++) {
			range = window.getSelection().getRangeAt(i)

			var startNode = range.startContainer
			var startOffset = range.startOffset
			var endNode = range.endContainer
			var endOffset = range.endOffset

			var orgS = startNode
			var orgSO = startOffset
			var orgE = endNode
			var orgEO = endOffset

			var target

			var newRange = document.createRange()
			newRange.setStart(startNode, startOffset)
			newRange.setEnd(endNode, endOffset)

			var isChanged = false

			// if (startNode.id === 'editor-body') {
			if (startNode === this.domManager.editor) {

				target = startNode.firstElementChild

				for (var i = 0; i < startOffset; i++) {
					// target = target.nextElementSibling
					target = target.nextSibling
				}



				if (target) {

					startNode = target
					newRange.setStart(startNode, 0)

					isChanged = true
				}



			}


			// if (endNode.id === 'editor-body') {
			if (endNode === this.domManager.editor) {


				target = endNode.firstChild

				for (var i = 0; i < endOffset - 1; i++) {
					// target = target.nextElementSibling
					target = target.nextSibling
				}

				if (target) {
					endNode = target

					newRange.setEnd(endNode, 1)

					isChanged = true
				}


			}



			var travelNode

			if (this.isTextContainNode(startNode)) {



				if (startOffset === 0) {
					travelNode = startNode.firstChild
					while (1) {
						if (!travelNode) {
							break
						} else if (travelNode.nodeType === 3) {
							startNode = travelNode
							newRange.setStart(startNode, 0)
							isChanged = true
							break
						} else {
							travelNode = travelNode.firstChild
						}
					}
				} else if (startOffset > 0) {
					travelNode = startNode.lastChild
					while (1) {
						if (!travelNode) {
							break
						} else if (travelNode.nodeType === 3) {
							startNode = travelNode
							newRange.setStart(startNode, startNode.textContent.length)
							isChanged = true
							break
						} else {
							travelNode = travelNode.lastChild
						}
					}
				}



			}

			if (this.isTextContainNode(endNode)) {



				if (endOffset > 0) {
					travelNode = endNode.lastChild
					while (1) {
						if (!travelNode) {
							break
						} else if (travelNode.nodeType === 3) {
							endNode = travelNode
							newRange.setEnd(endNode, endNode.textContent.length)
							isChanged = true
							break
						} else {
							travelNode = travelNode.lastChild
						}
					}
				} else if (endOffset === 0) {
					travelNode = endNode.firstChild
					while (1) {
						if (!travelNode) {
							break
						} else if (travelNode.nodeType === 3) {
							endNode = travelNode
							newRange.setEnd(endNode, 0)
							isChanged = true
							break
						} else {
							travelNode = travelNode.firstChild
						}
					}
				}



			}



			if (isChanged) {
				// this.replaceRange(newRange)
				// console.log(range)
				console.log("fixed selection")
				window.getSelection().removeRange(range)
				window.getSelection().addRange(newRange)
			}

		}


	}

	splitElementNode3(linkedRecord = false)
	{

		let orgRange = this.getRange()
		let startNode = orgRange.startContainer

		let currentParentNode = this.getNodeInSelection()

		let originalContent = currentParentNode.innerHTML
		let originalTextLength = currentParentNode.textContent.length

		let travelNode = startNode

		let frontNode, backNode

		// Textnode

		while (1) {

			if (
				this.isAvailableParentNode(travelNode) ||
				this.isAvailableChildNode(travelNode)
			) {

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
			this.replaceRange(newRange)

			frontNode = frontNode.parentNode
			backNode = backNode.parentNode

			travelNode = travelNode.parentNode

		}

		// Record action
		let afterClones = this.cloneNodeAndRange(currentParentNode, window.getSelection().getRangeAt(0))
		let action = {
			type: "split",
			target: currentParentNode,
			previousState: {
				content: originalContent,
				length: originalTextLength
			},
			nextState: {
				content: currentParentNode.innerHTML,
				length: currentParentNode.textContent.length,
				newNode: newNode
			},
			linked: linkedRecord
		}

		this.undoManager.recordAction(action)


	}

	/**
	 * Merge two nodes into a single node
	 * @param {Node} first
	 * @param {Node} second
	 * @param {Boolean} matchTopNode
	 */
	mergeNodes(first, second, matchTopNode = false, recordRangeState, linkedRecord = false)
	{
		console.log("merge method runs")

		if (!first || !second) {
			return
		}

		var front = first, back = second
		var tempNode
		var nextFront, nextBack

		var range = window.getSelection().getRangeAt(0)
		var startNode = this.getTextNodeInElementNode(first, "last")
		var startOffset
		if (startNode) {
			startOffset = startNode.textContent.length
		} else {
			startNode = this.getTextNodeInElementNode(second, "first")
			if (startNode) {
				startOffset = 0
			}
		}

		// record action
		let mergedNodeOriginalContent = first.innerHTML
		let mergedNodeOriginalContentLength = first.textContent.length
		let removedContent = second.innerHTML
		let removedContentTarget = second
		let removedNode, removedNodePreviousNode, removedNodeNextNode

		while (1) {

			if (!front || !back) {
				break
			}

			if (front.nodeName !== back.nodeName) {
				if (
					front === first &&
					back === second &&
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
				if (this.isListItem(back) && parentNode.querySelectorAll("LI").length === 1) {

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
			this.replaceRange(keepRange)

		}

		//record action
		let action = {
			type: "merge",
			mergedNode: first,
			mergedNodeOriginalContent: mergedNodeOriginalContent,
			mergedNodeOriginalContentLength: mergedNodeOriginalContentLength,
			mergedContent: first.innerHTML,
			removedNode: removedNode,
			removedNodePreviousNode: removedNodePreviousNode,
			removedNodeNextNode: removedNodeNextNode,
			removedContent: removedContent,
			removedContentTarget: removedContentTarget,
			range: recordRangeState
		}

		if (linkedRecord) {
			action.linked = true
		}

		this.undoManager.recordAction(action)

	}

	/**
	 * Splits text nodes based on the selection and
	 * returns start and end node.
	 * @return {Object.<Text>}
	 */
	splitTextNode()
	{
		var range = this.getRange()
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

		range = this.getRange()
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
	 * Remove selection.
	 */
	removeSelection(withKeyPress = "enter", linkedRecord = false)
	{
		var range
		range = this.getRange()

		let extraKeyPress = false

		var orgRange = range.cloneRange()
		if (!range) {
			return
		}

		var splitResult = this.splitTextNode()

		var startNode = range.startContainer
		var startOffset = range.startOffset

		if (splitResult.startNode !== startNode) {
			startNode = splitResult.startNode
			startOffset = 0
		}
		var endNode = splitResult.endNode

		var deletionDone = false
		var selectionNode = this.getNodeInSelection()
		var nextParentNode = this.getNextAvailableNode(selectionNode)

		// range.collapse(false)

		// console.log("startNode:", startNode, " endNode: ", endNode)

		range.setStart(range.endContainer, range.endOffset)
		this.replaceRange(range)

		var currentParentNode = selectionNode
		var travelNode = startNode
		var nextNode
		var parentNode

		var pRange = new PRange()
		var startTextOffset = pRange.getTextOffset(this.getNodeOfNode(orgRange.startContainer), orgRange.startContainer, orgRange.startOffset)
		var endTextOffset = pRange.getTextOffset(this.getNodeOfNode(orgRange.endContainer), orgRange.endContainer, orgRange.endOffset)

		var action = {
			type: "remove",
			targets: [],
			range: {
				previousState: {
					startTextOffset: startTextOffset,
					endTextOffset: endTextOffset,
					startNode: this.getNodeOfNode(orgRange.startContainer),
					endNode: this.getNodeOfNode(orgRange.endContainer)
				},
				nextState: {
					startTextOffset: 0,
					endTextOffset: 0
				}
			},
			linked: linkedRecord
		}
		this.undoManager.recordAction(action)

		while (1) {

			if (this.isImageBlock(currentParentNode)) {

				// Remove image block

				currentParentNode.parentNode.removeChild(currentParentNode)

			} else if (
				!currentParentNode.contains(startNode) &&
				!currentParentNode.contains(endNode)
			) {

				console.group("nothing contains")
				console.log(currentParentNode.textContent)

				extraKeyPress = true

				let originalContent = currentParentNode.innerHTML

				if (this.isAvailableChildNode(currentParentNode)) {

					console.log("list is detected")
					var parentNode = currentParentNode.parentNode

					if (this.isListItem(currentParentNode) && parentNode.querySelectorAll("LI").length === 1) {

						// record action
						action.targets.push({
							previousNode: parentNode.previousSibling,
							removedNode: parentNode,
							nextNode: parentNode.nextSibling,
							parentNode: parentNode.parentNode
						})

						parentNode.parentNode.removeChild(parentNode)

					} else {

						// record action
						action.targets.push({
							previousNode: currentParentNode.previousSibling,
							removedNode: currentParentNode,
							nextNode: currentParentNode.nextSibling,
							parentNode: currentParentNode.parentNode
						})

						currentParentNode.parentNode.removeChild(currentParentNode)

					}

				} else {

					// record action
					action.targets.push({
						previousNode: currentParentNode.previousSibling,
						removedNode: currentParentNode,
						nextNode: currentParentNode.nextSibling,
						parentNode: currentParentNode.parentNode
					})

					currentParentNode.parentNode.removeChild(currentParentNode)

				}

				console.groupEnd()

			} else if (
				currentParentNode.contains(startNode) &&
				!currentParentNode.contains(endNode)
			) {

				travelNode = startNode
				console.group("only contains startnode")
				console.log(currentParentNode.textContent)
				var metCurrentNode = false

				extraKeyPress = true

				var tempRange = document.createRange()
				tempRange.setStart(startNode, startOffset)
				tempRange.setEndAfter(currentParentNode.lastChild)

				let originalContent = currentParentNode.innerHTML

				tempRange.deleteContents()
				currentParentNode.normalize()

				if (this.isTextEmptyNode(currentParentNode)) {

					currentParentNode.innerHTML = ""
					currentParentNode.appendChild(document.createElement("br"))

				}

				// record action
				action.targets.push({
					removedNode: currentParentNode,
					originalContent: originalContent,
					modifiedContent: currentParentNode.innerHTML
				})

				console.groupEnd()

				if (withKeyPress === "delete") {
					this.setCursorAt(currentParentNode, -1)
				}

			} else if (
				!currentParentNode.contains(startNode) &&
				currentParentNode.contains(endNode)
			) {

				travelNode = endNode
				console.log("only contains endnode")
				console.log(currentParentNode.textContent)

				extraKeyPress = true


				var tempRange = document.createRange()
				tempRange.setStartBefore(currentParentNode.firstChild)
				tempRange.setEnd(endNode, orgRange.endOffset)

				let originalContent = currentParentNode.innerHTML

				tempRange.deleteContents()
				currentParentNode.normalize()

				if (this.isTextEmptyNode(currentParentNode)) {
					currentParentNode.innerHTML = ""
					currentParentNode.appendChild(document.createElement("br"))
				}

				// record action
				action.targets.push({
					removedNode: currentParentNode,
					originalContent: originalContent,
					modifiedContent: currentParentNode.innerHTML
				})


				if (withKeyPress === "backspace") {
					this.setCursorAt(currentParentNode)
				}

				break

			} else if (
				currentParentNode.contains(startNode) &&
				currentParentNode.contains(endNode)
			) {

				// Contains both startnode and endnode
				console.log("contains both")

				let originalContent = currentParentNode.innerHTML;

				orgRange.deleteContents()
				let pRange = new PRange()
				let cursorIndex = pRange.getTextOffset(currentParentNode, window.getSelection().getRangeAt(0).startContainer, window.getSelection().getRangeAt(0).startOffset)
				currentParentNode.normalize() // in safari cursor moves to the end

				this.setCursorAt(currentParentNode, cursorIndex) // solved safari problem

				if (this.isTextEmptyNode(currentParentNode)) {
					currentParentNode.innerHTML = ""
					currentParentNode.appendChild(document.createElement("br"))
				}

				// record action
				action.targets.push({
					removedNode: currentParentNode,
					originalContent: originalContent,
					modifiedContent: currentParentNode.innerHTML
				})

				if (withKeyPress === "enter") {
					this.enter(document.createEvent("KeyboardEvent"))
				}

				action.linked = false


				break

			}

			currentParentNode = nextParentNode
			nextParentNode = this.getNextAvailableNode(nextParentNode)

		}

		let afterRange = window.getSelection().getRangeAt(0)
		startTextOffset = pRange.getTextOffset(this.getNodeOfNode(afterRange.startContainer), afterRange.startContainer, afterRange.startOffset)
		endTextOffset = pRange.getTextOffset(this.getNodeOfNode(afterRange.endContainer), afterRange.endContainer, afterRange.endOffset)

		action.range.nextState.startTextOffset = startTextOffset
		action.range.nextState.endTextOffset = endTextOffset

		action.range.nextState.startNode = this.getNodeOfNode(afterRange.startContainer)
		action.range.nextState.endNode = this.getNodeOfNode(afterRange.endContainer)

		return extraKeyPress

	}

	/**
	 * Remove node from the editor
	 * @param {Node} node
	 */
	removeNode(node, recordRangeState, linkedRecord = false)
	{

		let parentNode = node.parentNode

		let action
		if (recordRangeState) {
			// record action
			action = {
				type: "remove",
				targets: [],
				range: recordRangeState,
				linked: linkedRecord
			}
		}

		if (this.isListItem(node)) {

			if (parentNode.querySelectorAll("LI").length === 1) {

				// record action
				if (recordRangeState) {
					action.targets.push({
						removedNode: parentNode,
						previousNode: parentNode.previousSibling,
						nextNode: parentNode.nextSibling,
						parentNode: parentNode.parentNode
					})
					this.undoManager.recordAction(action)
				}

				parentNode.parentNode.removeChild(parentNode)

			} else {

				// record action
				if (recordRangeState) {
					action.targets.push({
						removedNode: node,
						previousNode: node.previousSibling,
						nextNode: node.nextSibling,
						parentNode: node.parentNode
					})
					this.undoManager.recordAction(action)
				}

				parentNode.removeChild(node)

			}

		} else {

			// record action
			if (recordRangeState) {
				action.targets.push({
					removedNode: node,
					previousNode: node.previousSibling,
					nextNode: node.nextSibling,
					parentNode: node.parentNode
				})
				this.undoManager.recordAction(action)
			}

			parentNode.removeChild(node)

		}

	}

	/**
	 * Return true if the selection is empty.
	 */
	isEmpty()
	{
		if (document.getSelection().isCollapsed) {
			return true
		} else {
			return false
		}
	}




	/**
	 * If there isn't any of child nodes including "" text nodes, returns true.
	 * And truly clear the node to real empty.
	 * @param {HTMLElement} node
	 */
	isEmptyNode(node)
	{

		if (node.nodeType === 3) {
			return false
		}
		var travelNode = node.firstChild
		var nextNode = travelNode

		while (1) {

			if (!travelNode) {
				return true
			}

			nextNode = travelNode.nextSibling

			if (travelNode.nodeType === 3 && travelNode.textContent === "") {
				node.removeChild(travelNode)
			} else if (travelNode.nodeName !== "BR") {
				return false
			}

			travelNode = nextNode

		}
	}

	isTextEmptyNode(node)
	{
		if (node.nodeType === 3) {
			return false
		}

		if (
			node.textContent === ""
		) {
			return true
		} else {
			return false
		}
	}

	isAvailableEmptyNode(node) {
		if (node.nodeType === 3) {
			return false
		}

		if (
			node.textContent === ""
		) {
			return true
		} else {
			return false
		}
	}

	isTextContainNode(node)
	{
		if (
			this.isParagraph(node) ||
			this.isHeading(node)   ||
			this.isList(node)      ||
			this.isListItem(node)  ||
			this.isBlockquote(node)
		) {
			return true
		} else {
			return false
		}
	}

	isTextStyleNode(node)
	{
		if (
			this.isBold(node) ||
			this.isItalics(node)   ||
			this.isStrike(node)      ||
			this.isUnderline(node)  ||
			this.isLink(node)
		) {
			return true
		} else {
			return false
		}
	}

	isBold(node)
	{
		if (!node) {
			return false
		} else if (
			node.nodeName === 'B' ||
			node.nodeName === 'STRONG'
		) {
			return true
		} else {
			return false
		}
	}

	isItalics(node)
	{
		if (!node) {
			return false
		} else if (
			node.nodeName === 'I' ||
			node.nodeName === 'EM'
		) {
			return true
		} else {
			return false
		}
	}

	isStrike(node)
	{
		if (!node) {
			return false
		} else if (node.nodeName === 'STRIKE') {
			return true
		} else {
			return false
		}
	}

	isUnderline(node)
	{
		if (!node) {
			return false
		} else if (node.nodeName === 'U') {
			return true
		} else {
			return false
		}
	}

	isLink(node)
	{
		if (!node) {
			return false
		} else if (node.nodeName === 'A') {
			return true
		} else {
			return false
		}
	}

	/**
	 * Determine if the given node is a paragraph node which Povium understands.
	 * @param {Node} node
	 */
	isParagraph(node)
	{
		if (!node) {
			return false
		} else if (node.nodeName === 'P') {
			return true
		} else {
			return false
		}
	}

	isHeading(node)
	{
		if (!node) {
			return false
		} else if (
			node.nodeName === 'H1' ||
			node.nodeName === 'H2' ||
			node.nodeName === 'H3' ||
			node.nodeName === 'H4' ||
			node.nodeName === 'H5' ||
			node.nodeName === 'H6'
		) {
			return true
		} else {
			return false
		}
	}

	isList(node)
	{
		if (!node) {
			return false
		} else if (
			node.nodeName === 'OL' ||
			node.nodeName === 'UL'
		) {
			return true
		} else {
			return false
		}
	}

	isListItem(node)
	{
		if (!node) {
			return false
		} else if (node.nodeName === 'LI') {
			return true
		} else {
			return false
		}
	}

	isBlockquote(node)
	{
		if (!node) {
			return false
		} else if (node.nodeName === 'BLOCKQUOTE') {
			return true
		} else {
			return false
		}
	}

	/**
	 * Returns true if the node is an available image block.
	 * @param {HTMLElement} node
	 */
	isImageBlock(node)
	{
		if (!node) {
			return false
		} else if (node.nodeName === 'FIGURE' && node.classList && node.classList.contains('image')) {
			return true
		} else {
			return false
		}
	}

	isImageCaption(node) {
		if (!node) {
			return false
		} else if (node.nodeName === 'FIGCAPTION') {
			return true
		} else {
			return false
		}
	}

	isAvailableParentNode(node)
	{
		if (
			this.isParagraph(node) ||
			this.isHeading(node) ||
			this.isList(node) ||
			this.isBlockquote(node) ||
			this.isImageBlock(node)
		) {
			return true
		} else {
			return false
		}
	}

	isAvailableChildNode(node)
	{
		if (
			this.isListItem(node) ||
			this.isImageCaption(node)
		) {
			return true
		} else {
			return false
		}
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

	// getSelectionPosition(customRange = null)
	// {

	// 	var orgRange

	// 	if (customRange) {
	// 		orgRange = customRange
	// 	} else {
	// 		orgRange = this.getRange()
	// 	}

	// 	if (!orgRange) {
	// 		return false
	// 	}

	// 	var startNode   = orgRange.startContainer
	// 	var startOffset = orgRange.startOffset
	// 	var endNode     = orgRange.endContainer
	// 	var endOffset   = orgRange.endOffset


	// 	var travelNode
	// 	var isStart = false
	// 	var isEnd   = false


	// 	travelNode = startNode.previousSibling

	// 	while (1) {
	// 		if (!travelNode && startOffset === 0) {
	// 			isStart = true
	// 			break
	// 		} else if (!travelNode) {
	// 			break
	// 		} else if (travelNode.textContent === "") {
	// 			travelNode = travelNode.previousSibling
	// 		} else {
	// 			break
	// 		}
	// 	}



	// 	travelNode = endNode.nextSibling

	// 	while (1) {
	// 		if (!travelNode && endOffset === endNode.textContent.length) {
	// 			isEnd = true
	// 			break
	// 		} else if (!travelNode) {
	// 			break
	// 		} else if (travelNode.textContent === "") {
	// 			travelNode = travelNode.nextSibling
	// 		} else {
	// 			break
	// 		}
	// 	}


	// 	if (startNode === endNode && this.isEmptyNode(startNode)) {
	// 		isEnd = true
	// 	}

	// 	if (isStart) {
	// 		return 1
	// 	} else if (isEnd) {
	// 		return 3
	// 	} else {
	// 		return 2
	// 	}

	// }

	getSelectionPositionInParagraph(customRange = null)
	{
		var orgRange

		if (customRange) {
			orgRange = customRange
		} else {
			orgRange = this.getRange()
		}

		if (!orgRange) {
			return false
		}

		var startNode   = orgRange.startContainer
		var startOffset = orgRange.startOffset
		var endNode     = orgRange.endContainer
		var endOffset   = orgRange.endOffset


		var travelNode, parentNode
		var isStart = false
		var isEnd   = false


		parentNode = startNode.parentElement
		travelNode = startNode

		if (startOffset === 0) {
			while (1) {
				if (
					this.isAvailableParentNode(travelNode) ||
					this.isAvailableChildNode(travelNode)
				) {
					isStart = true
					break
				} else if (travelNode.previousSibling) {
					if (travelNode.previousSibling.textContent === "" || travelNode.previousSibling.nodeName === "BR") {
						travelNode = travelNode.previousSibling
					} else {
						isStart = false
						break
					}
				} else {
					travelNode = travelNode.parentElement
				}
			}
		}


		parentNode = endNode.parentElement
		travelNode = endNode
		if (endOffset === endNode.textContent.length) {
			while (1) {
				if (
					this.isAvailableParentNode(travelNode) ||
					this.isAvailableChildNode(travelNode)
				) {
					isEnd = true
					break
				} else if (travelNode.nextSibling) {
					if (travelNode.nextSibling.textContent === "" || travelNode.nextSibling.nodeName === "BR") {
						travelNode = travelNode.nextSibling
					} else {
						isEnd = false
						break
					}
				} else {
					travelNode = travelNode.parentElement
				}
			}
		}

		if (startNode === endNode && this.isEmptyNode(startNode)) {
			isStart = false
			isEnd = true
		}

		if (isStart) {
			return 1
		} else if (isEnd) {
			return 3
		} else {
			return 2
		}
	}



	// Getters


	/**
	 * @return {Range}
	 */
	getRange()
	{
		if (window.getSelection().rangeCount > 0) {
			// let rangeCount = window.getSelection().rangeCount
			return window.getSelection().getRangeAt(0)
		} else {
			return null
		}
	}

	/**
	 * Returns an array of all available nodes within the selection.
	 * @return {Array.<HTMLElement>}
	 */
	getAllNodesInSelection()
	{

		// let travelNode = this.getRange() ? this.getRange().startContainer : null
		let travelNode
		let nodes = []

		for (let i = 0; i < window.getSelection().rangeCount; i++) {

			travelNode = window.getSelection().getRangeAt(i).startContainer

			while (1) {


				if (!travelNode) {
					break
				} else if (this.isAvailableParentNode(travelNode)) {
					nodes.push(travelNode)
					if (travelNode.contains(this.getRange().endContainer)) {
						break
					} else {
						travelNode = travelNode.nextElementSibling
					}

				} else {
					travelNode = travelNode.parentElement
				}

			}

		}

		return nodes

	}

	/**
	 *
	 * @param {Node} node
	 * @return {Node}
	 */
	getPreviousAvailableNode(node)
	{
		var previousNode = node
		var travelNode = node.previousSibling
		var returnNode = null
		while (1) {
			if (travelNode === null) {
				if (this.isAvailableChildNode(previousNode)) {
					travelNode = previousNode.parentNode.previousSibling
					previousNode = travelNode
				} else {
					break
				}
			} else if (
				this.isAvailableParentNode(travelNode) ||
				this.isAvailableChildNode(travelNode)
			) {
				// Find the available node
				if (this.isList(travelNode)) {
					var itemNodes = travelNode.querySelectorAll("LI")
					travelNode = itemNodes[itemNodes.length - 1]
				}
				returnNode = travelNode
				break
			} else {
				travelNode = travelNode.previousSibling
			}
		}

		return returnNode
	}

	getNextAvailableNode(node)
	{
		var previousNode = node
		var travelNode = node.nextSibling
		var returnNode = null
		while (1) {
			if (travelNode === null) {
				if (this.isAvailableChildNode(previousNode)) {
					travelNode = previousNode.parentNode.nextSibling
					previousNode = travelNode
				} else {
					break
				}
			} else if (
				this.isAvailableParentNode(travelNode) ||
				this.isAvailableChildNode(travelNode)
			) {
				// Find the available node
				if (this.isList(travelNode)) {
					travelNode = travelNode.querySelectorAll("LI")[0]
				}
				returnNode = travelNode
				break
			} else {
				travelNode = travelNode.nextSibling
			}
		}

		return returnNode
	}

	getNodeInSelection()
	{

		var range = this.getRange()
		if (!range) {
			return
		}
		var travelNode = this.getRange().startContainer
		if (travelNode === null) {
			return null
		}

		while (1) {
			if (travelNode === null) {
				return null
			} else if (
				this.isAvailableParentNode(travelNode) ||
				this.isAvailableChildNode(travelNode)
			) {
				return travelNode
			} else {
				travelNode = travelNode.parentNode
			}
		}

	}

	/**
	 *
	 * @param {Node} node
	 */
	getNodeOfNode(node)
	{
		let tempNode = node
		let returnNode = null
		while (1) {
			if (tempNode.isEqualNode(this.domManager.editor) || tempNode.isEqualNode(document.body) || tempNode === null) {
				break
			} else if (this.isAvailableChildNode(tempNode) || this.isAvailableParentNode(tempNode)) {
				returnNode = tempNode
				break
			} else {
				tempNode = tempNode.parentNode
			}
		}

		return returnNode
	}

	/**
	 *
	 * @param {HTMLElement} node
	 * @param {Range} range
	 */
	cloneNodeAndRange(node, range = null)
	{

		// Loop node
		let nodeClone = document.createElement(node.nodeName)
		let rangeClone

		if (range) {
			rangeClone = document.createRange()
			rangeClone.setStart(range.startContainer, range.startOffset)
			rangeClone.setEnd(range.endContainer, range.endOffset)
		}


		let travelNode = node.firstChild
		let tempNode

		let insertTarget = nodeClone

		let loopDone = false

		while (1) {

			tempNode = travelNode.cloneNode(false)
			insertTarget.appendChild(tempNode)

			// console.log("travelNode: ", travelNode.cloneNode(true))

			if (range) {
				if (travelNode.isEqualNode(range.startContainer)) {
					rangeClone.setStart(tempNode, range.startOffset)
				}
				if (travelNode.isEqualNode(range.endContainer)) {
					rangeClone.setEnd(tempNode, range.endOffset)
				}
			}

			if (travelNode.firstChild) {

				insertTarget = tempNode
				travelNode = travelNode.firstChild

			} else if (travelNode.nextSibling) {

				travelNode = travelNode.nextSibling

			} else {

				let parentNode = travelNode.parentNode
				insertTarget = insertTarget.parentNode

				while (1) {

					if (parentNode.isEqualNode(node)) {

						loopDone = true
						break

					} else if (parentNode.nextSibling) {

						travelNode = parentNode.nextSibling
						break

					} else {
						parentNode = parentNode.parentNode
					}

				}

			}

			if (loopDone) {
				break
			}




			// tempNode = travelNode.cloneNode(false)
			// if (travelNode.isSameNode(range.startContainer)) {
			// 	rangeClone.startContainer = tempNode
			// }
			// nodeClone.appendChild(tempNode)

			// travelNode = travelNode.nextSibling

		}

		return [nodeClone, rangeClone]

	}

	/**
	 *
	 * @param {Node} node
	 * @param {Number} offset
	 */
	setCursorAt(node, offset = 0)
	{

		if (offset > node.textContent.length) {
			offset = -1
		}

		if (offset === -1) {
			offset = node.textContent.length
		}

		let pRange = new PRange()
		pRange.setStart(node, offset)
		let range = document.createRange()
		range.setStart(pRange.startContainer, pRange.startOffset)
		range.collapse(true)
		window.getSelection().removeAllRanges()
		window.getSelection().addRange(range)

	}

}
