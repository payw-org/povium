import DOMManager from "./DOMManager";
import UndoManager from "./UndoManager";

export default class SelectionManager
{

	/**
	 * 
	 * @param {DOMManager} domManager 
	 * @param {UndoManager} undoManager 
	 */
	constructor(domManager, undoManager)
	{

		this.domManager = domManager;
		this.undoManager = undoManager;

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

		// document.execCommand('styleWithCSS', true);
		// document.execCommand(direction, false);

		var chunks = this.getAllNodesInSelection();
		var node;

		var action = {
			type: "align",
			nodes: [],
			range: this.getRange()
		};

		for (var i = 0; i < chunks.length; i++) {

			if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
				console.warn('The node is not a paragraph nor a heading.')
				continue;
			}

			action.nodes.push({
				target: chunks[i],
				previousState: chunks[i].style.textAlign,
				nextState: direction
			});
			chunks[i].style.textAlign = direction;

		}

		this.undoManager.recordAction(action);
		
	}


	/**
	 * Make the selection bold.
	 */
	bold()
	{
		document.execCommand('bold', false);
	}

	/**
	 * Make the selection italics.
	 */
	italic()
	{
		document.execCommand('italic', false);
	}

	underline()
	{
		document.execCommand('underline', false);
	}

	strike()
	{
		document.execCommand('strikeThrough', false);
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
		
		let orgRange = this.getRange();
		if (!orgRange) {
			return;
		}

		let startNode = orgRange.startContainer;
		let startOffset = orgRange.startOffset;
		let endNode = orgRange.endContainer;
		let endOffset = orgRange.endOffset;
		let chunks = this.getAllNodesInSelection();

		

		for (var i = 0; i < chunks.length; i++) {

			if (
				!this.isParagraph(chunks[i]) &&
				!this.isHeading(chunks[i])
			) {
				console.warn('The node is not a paragraph nor a heading.')
				continue;
			}

			if (chunks[i].nodeName === type) {
				type = "P";
			}

			var changedNode = this.changeNodeName(chunks[i], type);
			if (chunks[i] === startNode) {
				startNode = changedNode;
			}
			if (chunks[i] === endNode) {
				endNode = changedNode;
			}

		}

		
		var keepRange = document.createRange();
		keepRange.setStart(startNode, startOffset);
		keepRange.setEnd(endNode, endOffset);
		this.replaceRange(keepRange);

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

		let orgRange = this.getRange();
		if (!orgRange) {
			return;
		}

		if (type === undefined) {
			console.error("List type undefined.");
		}

		let startNode = orgRange.startContainer;
		let startOffset = orgRange.startOffset;
		let endNode = orgRange.endContainer;
		let endOffset = orgRange.endOffset;

		// Multiple range - Experimental
		endNode = window.getSelection().getRangeAt(window.getSelection().rangeCount - 1).endContainer;
		endOffset = window.getSelection().getRangeAt(window.getSelection().rangeCount - 1).endOffset;

		let chunks = this.getAllNodesInSelection();
		let listElm = document.createElement(type);
		var placedListElm = false;
		var placedListElmIndex;
		var node;

		var unlockList = true;
		var recordList = [];

		for (var i = 0; i < chunks.length; i++) {

			// if (chunks[i].textContent === "") {
			// 	continue;
			// }

			if (
				this.isParagraph(chunks[i]) ||
				this.isHeading(chunks[i])
			) {

				var itemElm = document.createElement('LI');

				while (node = chunks[i].firstChild) {

					itemElm.appendChild(node);

				}

				if (chunks[i] === startNode) {
					startNode = itemElm;
				}
	
				if (chunks[i] === endNode) {
					endNode = itemElm;
				}

				listElm.appendChild(itemElm);

				if (!placedListElm) {
					placedListElmIndex = i;
					placedListElm = true;
				} else {
					chunks[i].parentNode.removeChild(chunks[i]);
				}
				

				unlockList = false;

			} else if (this.isList(chunks[i])) {

				// If the node is already a list
				// move items inside to the new list element.

				if (!recordList.includes(chunks[i])) {
					recordList.push(chunks[i]);
				}

				if (recordList.length > 1) {
					unlockList = false;
				}

				while (node = chunks[i].firstChild) {

					listElm.appendChild(node);

				}
				

				if (!placedListElm) {
					placedListElmIndex = i;
					placedListElm = true;
				} else {
					chunks[i].parentNode.removeChild(chunks[i]);
				}

			}

		}

		if (listElm.childElementCount < 1) {
			return;
		}

		// this.getRange().insertNode(listElm);
		chunks[0].parentNode.replaceChild(listElm, chunks[placedListElmIndex]);

		if (unlockList) {

			var range = document.createRange();
			var itemNode, nextNode;
			var part1 = true, part2 = false, part3 = false;
			var part1ListElm = document.createElement(type), part3ListElm = document.createElement(type);
			var part1ListElmInserted = false, part3ListElmInserted = false;
			var part3Will = false;

			range.setStartAfter(listElm);
			this.replaceRange(range);

			itemNode = listElm.firstChild;
			nextNode = itemNode;

			while (itemNode) {

				nextNode = itemNode.nextElementSibling;

				if (itemNode.nodeName !== "LI") {
					itemNode = itemNode.nextElementSibling;
					continue;
				}

				if (itemNode.contains(startNode)) {
					part1 = false;
					part2 = true;
					part3 = false;
				}

				if (itemNode.contains(endNode)) {
					part3Will = true;
				}





				if (part1) {

					part1ListElm.appendChild(itemNode);

					if (!part1ListElmInserted) {
						range.insertNode(part1ListElm);
						range.setStartAfter(part1ListElm);
						part1ListElmInserted = true;
					}
					
				} else if (part2) {

					var pElm = document.createElement('P');
					while (node = itemNode.firstChild) {
						pElm.appendChild(node)
					}

					range.insertNode(pElm);
					range.setStartAfter(pElm);

				} else if (part3) {

					part3ListElm.appendChild(itemNode);
					
					if (!part3ListElmInserted) {
						range.insertNode(part3ListElm);
						range.setStartAfter(part3ListElm);
						part3ListElmInserted = true;
					}

				}

				if (itemNode === startNode) {
					startNode = pElm;
				}
	
				if (itemNode === endNode) {
					endNode = pElm;
				}

			

				if (part3Will) {
					part1 = false;
					part2 = false;
					part3 = true;
				}
			

				itemNode = nextNode;


			}

			if (this.domManager.editor.contains(listElm)) {
				this.domManager.editor.removeChild(listElm);
			}
			

		}


		console.log(startNode, endNode);

		var keepRange = document.createRange();
		keepRange.setStart(startNode, startOffset);
		keepRange.setEnd(endNode, endOffset);

		this.replaceRange(keepRange);

		this.fixSelection();

	}

	link(url)
	{
		var range = this.getRange();
		if (!range) {
			return;
		}

		// if (range.collapsed) {
		// 	return;
		// }

		document.execCommand('createLink', false, url);
		document.getSelection().removeAllRanges();

		this.domManager.hidePopTool();
		
	}

	unlink(linkNode) {
		var node;
		var tempRange = document.createRange();
		tempRange.setStartAfter(linkNode);
		console.log("link is already set");
		while (node = linkNode.firstChild) {
			tempRange.insertNode(node);
			tempRange.setStartAfter(node);
		}
		linkNode.parentNode.removeChild(linkNode);
		document.getSelection().removeAllRanges();
	}

	blockquote()
	{
		let orgRange = this.getRange();
		if (!orgRange) {
			return;
		}

		let startNode = orgRange.startContainer;
		let startOffset = orgRange.startOffset;
		let endNode = orgRange.endContainer;
		let endOffset = orgRange.endOffset;
		let chunks = this.getAllNodesInSelection();

		var isAllBlockquote = true;

		for (var i = 0; i < chunks.length; i++) {

			if (chunks[i].nodeName === "BLOCKQUOTE") {
				continue;
			} else {
				isAllBlockquote = false;
			}

			// if (chunks[i].textContent === "") {
			// 	continue;
			// }

			if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
				console.warn('The node is not a paragraph nor a heading.')
				continue;
			}

			var changedNode = this.changeNodeName(chunks[i], "blockquote", false);
			if (chunks[i] === startNode) {
				startNode = changedNode;
			}
			if (chunks[i] === endNode) {
				endNode = changedNode;
			}

		}

		// Selection is all blockquote
		if (isAllBlockquote) {
			for (var i = 0; i < chunks.length; i++) {
				var changedNode = this.changeNodeName(chunks[i], "P", false);
				if (chunks[i] === startNode) {
					startNode = changedNode;
				}
				if (chunks[i] === endNode) {
					endNode = changedNode;
				}
			}
		}


		var keepRange = document.createRange();
		keepRange.setStart(startNode, startOffset);
		keepRange.setEnd(endNode, endOffset);
		this.replaceRange(keepRange);
	}


	/**
	 * Backspace implementation
	 */
	backspace(e)
	{

		// Get current available node
		var currentNode = this.getNodeInSelection();

		var range = this.getRange();
		if (!range.collapsed) {
			console.log("pressed backspace but the range is not collapsed");
			e.stopPropagation();
			e.preventDefault();
			this.removeSelection("start");
			
			return;
		}

		// Backspace key - Empty node
		if (currentNode && this.isAvailableEmptyNode(currentNode)) {

			e.stopPropagation();
			e.preventDefault();

			if (
				(this.isAvailableChildNode(currentNode) ||
				this.isAvailableParentNode(currentNode)) &&
				this.getPreviousAvailableNode(currentNode)
			) {

				var previousNode = this.getPreviousAvailableNode(currentNode);

				console.log("empty child node or parent node");

				if (this.isAvailableEmptyNode(previousNode)) {
					if (this.isAvailableChildNode(previousNode)) {
						console.log("previous node is child");
						var parentNode = previousNode.parentNode;
						previousNode.parentNode.removeChild(previousNode);
						if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
							parentNode.parentNode.removeChild(parentNode);
						}
					} else {
						previousNode.parentNode.removeChild(previousNode);
					}
				} else {
					var range = document.createRange();
					range.setStartAfter(previousNode.lastChild);
					this.replaceRange(range);

					if (this.isAvailableChildNode(currentNode)) {
						var parentNode = currentNode.parentNode;
						currentNode.parentNode.removeChild(currentNode);
						if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
							parentNode.parentNode.removeChild(parentNode);
						}
					} else {
						currentNode.parentNode.removeChild(currentNode);
					}
				}

				


			} else {
				if (this.isListItem(currentNode)) {
					this.list(currentNode.parentNode.nodeName);
				} else if (
					this.isAvailableParentNode(currentNode) &&
					!this.isParagraph(currentNode)
				) {
					this.changeNodeName(currentNode, "P");
				}
				
			}

		} else if (currentNode && this.getSelectionPositionInParagraph() === 1) {

			// backspace - caret position at start of the node
			e.stopPropagation();
			e.preventDefault();
			console.log("move this line to previous line");

			if (
				(this.isAvailableChildNode(currentNode) ||
				this.isAvailableParentNode(currentNode)) &&
				this.getPreviousAvailableNode(currentNode)
			) {

				console.log("child node or parentnode");

				var previousNode = this.getPreviousAvailableNode(currentNode);

				if (this.isAvailableEmptyNode(previousNode)) {
					if (this.isAvailableChildNode(previousNode)) {
						console.log("previous node is child");
						var parentNode = previousNode.parentNode;
						previousNode.parentNode.removeChild(previousNode);
						if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
							parentNode.parentNode.removeChild(parentNode);
						}
					} else {
						previousNode.parentNode.removeChild(previousNode);
					}
				} else {


					var node, orgRange = this.getRange();

					var startNode = orgRange.startContainer, startOffset = orgRange.startOffset;
					var endNode = orgRange.endContainer, endOffset = orgRange.endOffset;

					var br = previousNode.querySelector("br");
					if (br) {
						br.parentNode.removeChild(br);
					}

					if (this.isAvailableChildNode(currentNode)) {
						var parentNode = currentNode.parentNode;
						this.mergeNodes(previousNode, currentNode, true);
						if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
							parentNode.parentNode.removeChild(parentNode);
						}
					} else {
						this.mergeNodes(previousNode, currentNode, true);
					}

				}

					

			}

		}
		

	}

	delete(e)
	{
		// Get current available node
		var currentNode = this.getNodeInSelection();

		var range = this.getRange();
		if (!range.collapsed) {
			e.stopPropagation();
			e.preventDefault();
			this.removeSelection("start");
			return;
		}

		// Delete key - Empty node
		if (currentNode && currentNode.textContent.length === 0) {

			e.stopPropagation();
			e.preventDefault();

			if (
				(this.isAvailableChildNode(currentNode) ||
				this.isAvailableParentNode(currentNode)) &&
				this.getNextAvailableNode(currentNode)
			) {

				var nextNode = this.getNextAvailableNode(currentNode);

				console.log("empty child node or parent node");

				if (nextNode) {
					var range = document.createRange();
					range.setStartBefore(nextNode.firstChild);
					this.replaceRange(range);

					if (this.isAvailableChildNode(currentNode)) {
						var parentNode = currentNode.parentNode;
						currentNode.parentNode.removeChild(currentNode);
						if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
							parentNode.parentNode.removeChild(parentNode);
						}
					} else {
						currentNode.parentNode.removeChild(currentNode);
					}

				}

			} else {
				var range = document.createRange();
				range.setStart(currentNode, 0);
				range.setEnd(currentNode, 0);
				this.replaceRange(range);
			}

		} else if (currentNode && this.getSelectionPositionInParagraph() === 3) {

			// Delete key - caret position at the end of the node
			e.stopPropagation();
			e.preventDefault();
			console.log("pull the next node to current.");

			if (
				(this.isAvailableChildNode(currentNode) ||
				this.isAvailableParentNode(currentNode)) &&
				this.getNextAvailableNode(currentNode)
			) {

				var nextNode = this.getNextAvailableNode(currentNode);

				if (nextNode) {

					var br = nextNode.querySelector("br");
					if (br) {
						br.parentNode.removeChild(br);
					}

					if (this.isAvailableChildNode(nextNode)) {
						var parentNode = nextNode.parentNode;
						this.mergeNodes(currentNode, nextNode, true);
						if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
							parentNode.parentNode.removeChild(parentNode);
						}
					} else {
						if (this.isImageBlock(nextNode)) {
							nextNode.parentNode.removeChild(nextNode);
						} else {
							this.mergeNodes(currentNode, nextNode, true);
						}
						
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

		var selectionNode = this.getNodeInSelection();
		var range = this.getRange();

		if (!range.collapsed) {

			e.stopPropagation();
			e.preventDefault();
			this.removeSelection();
			return;

		}

		// Delete the br if the current sentence is not empty
		var currentNode = this.getNodeInSelection();

		if (currentNode && currentNode.textContent !== "" && currentNode.querySelector("br")) {

			currentNode.removeChild(currentNode.querySelector("br"));

		}

		// Ignore figcaption enter
		if (this.isImageCaption(currentNode)) {

			e.stopPropagation();
			e.preventDefault();
			return;

		}

		var selPosType = this.getSelectionPositionInParagraph();

		e.stopPropagation();
		e.preventDefault();

		if (selPosType === 2) {

			console.log('middle');
			this.splitElementNode3();

		} else if (selPosType === 1) {

			console.log('start');
			var pElm = this.domManager.generateEmptyNode(selectionNode.nodeName);

			selectionNode.parentNode.insertBefore(pElm, selectionNode);

		} else if (selPosType === 3) {

			console.log('end');
			var newNodeName = selectionNode.nodeName;
			var parentNode = selectionNode.parentNode;
			var nextNode = selectionNode.nextSibling;

			if (
				this.isBlockquote(selectionNode) ||
				this.isHeading(selectionNode)
			) {

				newNodeName = "P";

			} else if (this.isListItem(selectionNode)) {
				if (this.isEmptyNode(selectionNode)) {

					this.list(selectionNode.parentNode.nodeName);
					return;
					
				}
				
			}

			var pElm = this.domManager.generateEmptyNode(newNodeName);

			console.log(pElm);

			console.log(parentNode);

			parentNode.insertBefore(pElm, nextNode);

			// Record action
			var action = {
				type: "add",
				nodes: [],
				range: this.getRange()

			}
			action.nodes.push({
				target: pElm
			});

			this.undoManager.recordAction(action);



			var range = document.createRange();
			range.setStartBefore(pElm.firstChild);
			range.collapse(true);

			this.replaceRange(range);

		}


	}



	clearRange()
	{
		document.getSelection().removeAllRanges();
	}

	/**
	 * 
	 * @param {Range} range 
	 */
	replaceRange(range)
	{
		if (!range) {
			console.warn("range is not available.", range);
			return;
		}
		document.getSelection().removeAllRanges();
		document.getSelection().addRange(range);
	}

	/**
	 * Replace the node if the node is inside the editor,
	 * else return the new node.
	 * @param {HTMLElement} targetNode An HTML element you want to change its node name.
	 * @param {String} newNodeName New node name for the target element.
	 */
	changeNodeName(targetNode, newNodeName, keepStyle = true)
	{

		// Move all the nodes inside the target node
		// to the new generated node with new node name,
		// as well as preserving the range
		// if the startContainer or the endContainer are included
		// in the original node.

		if (targetNode.nodeType !== 1) {
			// If the node is not an HTML element do nothing.
			return;
		}

		// 1. Change node
		var node;
		var newNode = document.createElement(newNodeName);

		if (keepStyle) {
			newNode.style.textAlign = targetNode.style.textAlign;
		}
		

		while (node = targetNode.firstChild) {
			newNode.appendChild(node);
		}

		// 3. replace node
		targetNode.parentNode.replaceChild(newNode, targetNode);

		return newNode;

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
		var range = this.getRange();
		if (!range) {
			return;
		}


		for (var i = 0; i < window.getSelection().rangeCount; i++) {
			range = window.getSelection().getRangeAt(i);

			var startNode = range.startContainer;
			var startOffset = range.startOffset;
			var endNode = range.endContainer;
			var endOffset = range.endOffset;

			var orgS = startNode;
			var orgSO = startOffset;
			var orgE = endNode;
			var orgEO = endOffset;

			var target;

			var newRange = document.createRange();
			newRange.setStart(startNode, startOffset);
			newRange.setEnd(endNode, endOffset);

			var isChanged = false;

			// if (startNode.id === 'editor-body') {
			if (startNode === this.domManager.editor) {

				target = startNode.firstElementChild;

				for (var i = 0; i < startOffset; i++) {
					// target = target.nextElementSibling;
					target = target.nextSibling;
				}

				

				if (target) {

					startNode = target;
					newRange.setStart(startNode, 0);

					isChanged = true;
				}

				

			}


			// if (endNode.id === 'editor-body') {
			if (endNode === this.domManager.editor) {


				target = endNode.firstChild;

				for (var i = 0; i < endOffset - 1; i++) {
					// target = target.nextElementSibling;
					target = target.nextSibling;
				}

				if (target) {
					endNode = target;

					newRange.setEnd(endNode, 1);

					isChanged = true;
				}
				

			}



			var travelNode;

			if (this.isTextContainNode(startNode)) {



				if (startOffset === 0) {
					travelNode = startNode.firstChild;
					while (1) {
						if (!travelNode) {
							break;
						} else if (travelNode.nodeType === 3) {
							startNode = travelNode;
							newRange.setStart(startNode, 0);
							isChanged = true;
							break;
						} else {
							travelNode = travelNode.firstChild;
						}
					}
				} else if (startOffset > 0) {
					travelNode = startNode.lastChild;
					while (1) {
						if (!travelNode) {
							break;
						} else if (travelNode.nodeType === 3) {
							startNode = travelNode;
							newRange.setStart(startNode, startNode.textContent.length);
							isChanged = true;
							break;
						} else {
							travelNode = travelNode.lastChild;
						}
					}
				}

				

			}

			if (this.isTextContainNode(endNode)) {

				

				if (endOffset > 0) {
					travelNode = endNode.lastChild;
					while (1) {
						if (!travelNode) {
							break;
						} else if (travelNode.nodeType === 3) {
							endNode = travelNode;
							newRange.setEnd(endNode, endNode.textContent.length);
							isChanged = true;
							break;
						} else {
							travelNode = travelNode.lastChild;
						}
					}
				} else if (endOffset === 0) {
					travelNode = endNode.firstChild;
					while (1) {
						if (!travelNode) {
							break;
						} else if (travelNode.nodeType === 3) {
							endNode = travelNode;
							newRange.setEnd(endNode, 0);
							isChanged = true;
							break;
						} else {
							travelNode = travelNode.firstChild;
						}
					}
				}

				

			}



			if (isChanged) {
				// this.replaceRange(newRange);
				console.log(range);
				console.log("fixed selection");
				window.getSelection().removeRange(range);
				window.getSelection().addRange(newRange);
			}

		}


		// Multiple ranges to a single range!!!!!!!!!!!!!
		// range = window.getSelection().getRangeAt(0);
		// var rangeCount = window.getSelection().rangeCount;

		// startNode = range.startContainer;
		// startOffset = range.startOffset;
		
		// endNode = window.getSelection().getRangeAt(rangeCount - 1).endContainer;
		// endOffset = window.getSelection().getRangeAt(rangeCount - 1).endOffset;

		// newRange.setStart(startNode, startOffset);
		// newRange.setEnd(endNode, endOffset);

		// window.getSelection().removeAllRanges();
		// window.getSelection().addRange(newRange);
		
		
	}


	/**
	 * Implementing return(enter) key inside blockquotes.
	 */

	// Deprecated

	// splitElementNode()
	// {

	// 	var range;

	// 	range = this.getRange();
		
	// 	if (!range) {
	// 		return;
	// 	}

	// 	var startNode = range.startContainer;
	// 	var startOffset = range.startOffset;
	// 	var endNode = range.endContainer;
	// 	var endOffset = range.endOffset;

	// 	var frontNode, backNode;
	// 	var backNodePassed = false;

	// 	var travelNode = startNode;

	// 	var tempNode, nextNode;

	// 	var orgNode;
	// 	var newNode;

	// 	// Loop from the bottom to the top of the node.
		
	// 	while (1) {

	// 		console.log(travelNode);

	// 		if (travelNode === null) {

	// 			break;

	// 		} else if (this.isAvailableParentNode(travelNode)) {

	// 			break;

	// 		} else if (travelNode.nodeType === 3) {

	// 			if (startOffset === 0) {

	// 				if (startNode.previousSibling) {
	// 					frontNode = startNode.previousSibling;
	// 					backNode = startNode;
	// 				} else if (this.isTextStyleNode(startNode.parentNode)) {
	// 					travelNode = startNode.parentNode;
	// 				}

	// 			} else {
	// 				this.splitTextNode();
	// 				frontNode = startNode;
	// 				backNode = frontNode.nextSibling;
	// 				console.log("3");
	// 			}
					
	// 			// }

	// 		} else if (this.isTextStyleNode(travelNode)) {

	// 			console.log("this is a text style node");

	// 			console.log(frontNode);
	// 			console.log(backNode);

	// 			if (frontNode === undefined) {
	// 				frontNode = travelNode.previousSibling;
	// 			}

	// 			if (backNode === undefined) {
	// 				backNode = travelNode;
	// 			}

	// 		} else {

	// 			break;

	// 		}

	// 		orgNode = travelNode.parentElement;
			
	// 		newNode = document.createElement(orgNode.nodeName);

	// 		tempNode = orgNode.firstChild;

	// 		if (!frontNode) {

	// 			frontNode = backNode.previousSibling;

	// 		}

	// 		if (!backNode) {

	// 			backNode = frontNode.nextSibling;

	// 		}

	// 		console.log('-------------------');
	// 		console.log(frontNode, backNode, newNode);

	// 		while (1) {
				
	// 			if (!tempNode) {

	// 				backNodePassed = false;
	// 				break;

	// 			} else {

	// 				nextNode = tempNode.nextSibling;

	// 			}

	// 			if (tempNode === backNode) {

	// 				backNodePassed = true;

	// 			}

	// 			if (backNodePassed) {

	// 				newNode.appendChild(tempNode);

	// 			}

	// 			tempNode = nextNode;

	// 		}

	// 		if (this.isEmptyNode(orgNode)) {

	// 			orgNode.parentNode.removeChild(orgNode);
	// 			orgNode = null;

	// 		}

	// 		if (!this.isEmptyNode(newNode)) {

	// 			orgNode.parentNode.insertBefore(newNode, orgNode.nextSibling);

	// 			// Record action
	// 			var action = {
	// 				type: "split",
	// 				nodes: [],
	// 				range: range
	// 			}
	// 			action.nodes.push({
	// 				target: newNode,
	// 				previousNode: this.getPreviousAvailableNode(newNode)
	// 			});

	// 			this.undoManager.recordAction(action);

	// 		} else {

	// 			newNode = null;

	// 		}

	// 		frontNode = orgNode;
	// 		backNode = newNode;


	// 		// If there is a newNode inserted,
	// 		// move a range to it.
	// 		if (newNode) {

	// 			range.setStart(newNode, 0);
	// 			this.replaceRange(range);

	// 		}
			

	// 		travelNode = travelNode.parentNode;

	// 	}

	// }

	splitElementNode3()
	{
		
		var orgRange = this.getRange();
		var startNode = orgRange.startContainer;
		console.log(startNode);

		var travelNode = startNode;

		var frontNode, backNode;

		// Textnode

		while (1) {

			if (
				this.isAvailableParentNode(travelNode) ||
				this.isAvailableChildNode(travelNode)
			) {

				return;

			} else if (travelNode.nodeType === 3) {

				if (orgRange.startOffset === 0) {

					if (travelNode.previousSibling) {

						frontNode = travelNode.previousSibling;
						backNode = travelNode;

					} else if (travelNode.parentNode) {

						travelNode = travelNode.parentNode;

						continue;

					}

				} else if (orgRange.startOffset < travelNode.textContent.length) {

					this.splitTextNode();

					frontNode = travelNode;
					backNode = travelNode.nextSibling;

				} else {

					if (travelNode.nextSibling) {

						frontNode = travelNode;
						backNode = travelNode.nextSibling;

					} else if (travelNode.parentNode) {

						travelNode = travelNode.parentNode;

						continue;

					}

				}

			} else if (frontNode === undefined && backNode === undefined) {

				if (orgRange.startOffset === 0) {

					if (travelNode.previousSibling) {

						frontNode = travelNode.previousSibling;
						backNode = travelNode;

					} else if (travelNode.parentNode) {

						travelNode = travelNode.parentNode;
						continue;

					}
					

				} else if (orgRange.startOffset > 0) {

					if (travelNode.nextSibling) {

						frontNode = travelNode;
						backNode = travelNode.nextSibling;

					} else if (travelNode.parentNode) {

						travelNode = travelNode.parentNode;

						continue;

					}

				}

			}

			travelNode = frontNode;
			

			var newNode = document.createElement(travelNode.parentNode.nodeName);

			var tempNode = backNode;
			var nextNode;

			console.log("front: ", frontNode, " back: ", backNode, " newNode: ", newNode);

			while(1) {

				if (!tempNode) {
					break;
				}

				nextNode = tempNode.nextSibling;

				newNode.appendChild(tempNode);

				tempNode = nextNode;

			}

			travelNode.parentNode.parentNode.insertBefore(newNode, travelNode.parentNode.nextSibling);
			var newRange = document.createRange();
			newRange.setStart(this.getTextNodeInElementNode(newNode, "first"), 0);
			newRange.collapse(true);
			this.replaceRange(newRange);

			frontNode = frontNode.parentNode;
			backNode = backNode.parentNode;

			travelNode = travelNode.parentNode;

			// Record action
			var action = {
				type: "split",
				nodes: [],
				range: this.getRange()
			}
			action.nodes.push({
				target: pElm
			});

			this.undoManager.recordAction(action);

		}

	}

	mergeNodes(first, second, matchTopNode = false)
	{
		console.log("merge method runs");

		if (!first || !second) {
			return;
		}

		var front = first, back = second;
		var tempNode;
		var nextFront, nextBack;

		var range = window.getSelection().getRangeAt(0);
		var startNode = this.getTextNodeInElementNode(first, "last");
		var startOffset;
		if (startNode) {
			startOffset = startNode.textContent.length;
		} else {
			startNode = this.getTextNodeInElementNode(second, "first");
			if (startNode) {
				startOffset = 0;
			}
		}

		

		while (1) {

			console.log("front: ", front, " back: ", back);

			if (!front || !back) {
				break;
			}

			if (front.nodeName !== back.nodeName) {
				if (
					front === first &&
					back === second &&
					matchTopNode
				) {
					
				} else {
					break;
				}
				
			}

			if (front.nodeType === 3) {

				front.textContent += back.textContent;
				back.parentNode.removeChild(back);

				break;

			} else {

				console.log("here");

				console.log("front: ", front, " back: ", back);

				nextFront = front.lastChild;
				nextBack = back.firstChild;

				while (tempNode = back.firstChild) {
					front.appendChild(tempNode);
				}

				back.parentNode.removeChild(back);

				front = nextFront;
				back = nextBack;

			}

		}

		if (startNode) {

			var keepRange = document.createRange();
			keepRange.setStart(startNode, startOffset);
			keepRange.setEnd(startNode, startOffset);
			this.replaceRange(keepRange);

		}
		

	}

	/**
	 * Splits text nodes based on the selection and
	 * returns start and end node.
	 * @return {Object.<Text>}
	 */
	splitTextNode()
	{
		var range = this.getRange();
		if (!range) {
			return;
		}
		var startNode = range.startContainer;
		var startOffset = range.startOffset;

		var returnNode = {
			startNode: null,
			endNode: null
		}

		returnNode.startNode = startNode;
		
		// Split start of the range.
		if (
			startNode.nodeType === 3 &&
			startOffset > 0 &&
			startOffset < startNode.textContent.length
		) {
			
			returnNode.startNode = startNode.splitText(startOffset);

		}

		range = this.getRange();
		var endNode = range.endContainer;
		var endOffset = range.endOffset;

		returnNode.endNode = endNode;

		// Split end of the range.
		if (
			startNode !== endNode &&
			endNode.nodeType === 3 &&
			endOffset < endNode.textContent.length
		) {

			endNode.splitText(endOffset);

		}

		return returnNode;

	}

	/**
	 * Remove selection.
	 */
	removeSelection(collapseDirection = "end")
	{
		var range;
		range = this.getRange();

		var orgRange = range.cloneRange();
		if (!range) {
			return;
		}

		var splitResult = this.splitTextNode();

		var startNode = range.startContainer;
		var startOffset = range.startOffset;;

		if (splitResult.startNode !== startNode) {
			startNode = splitResult.startNode;
			startOffset = 0;
		}
		var endNode = splitResult.endNode;
		
		var deletionDone = false;
		var selectionNode = this.getNodeInSelection();
		var nextParentNode = this.getNextAvailableNode(selectionNode);

		// range.collapse(false);

		// console.log("startNode:", startNode, " endNode: ", endNode);

		range.setStart(range.endContainer, range.endOffset);
		this.replaceRange(range);
		

		var currentParentNode = selectionNode;
		var travelNode = startNode;
		var nextNode;
		var parentNode;

		while (1) {

			if (this.isImageBlock(currentParentNode)) {

				currentParentNode.parentNode.removeChild(currentParentNode);

			} else if (
				!currentParentNode.contains(startNode) &&
				!currentParentNode.contains(endNode)
			) {

				console.log("nothing contains");
				console.log(currentParentNode.textContent);

				if (this.isAvailableChildNode(currentParentNode)) {

					console.log("list is detected");
					var parentNode = currentParentNode.parentNode;
					currentParentNode.parentNode.removeChild(currentParentNode);

					if (this.isTextEmptyNode(parentNode)) {
						parentNode.parentNode.removeChild(parentNode);
					}

				} else {
					
					currentParentNode.parentNode.removeChild(currentParentNode);

				}
				
			} else if (
				currentParentNode.contains(startNode) &&
				!currentParentNode.contains(endNode)
			) {

				travelNode = startNode;
				console.log("only contains startnode");
				console.log(currentParentNode.textContent);
				var metCurrentNode = false;

				var tempRange = document.createRange();
				tempRange.setStart(startNode, startOffset);
				tempRange.setEndAfter(currentParentNode.lastChild);

				tempRange.deleteContents();

				if (this.isTextEmptyNode(currentParentNode)) {

					currentParentNode.innerHTML = "";
					currentParentNode.appendChild(document.createElement("br"));

				}

			} else if (
				!currentParentNode.contains(startNode) &&
				currentParentNode.contains(endNode)
			) {

				travelNode = endNode;
				console.log("only contains endnode");
				console.log(currentParentNode.textContent);


				var tempRange = document.createRange();
				tempRange.setStartBefore(currentParentNode.firstChild);
				tempRange.setEnd(endNode, orgRange.endOffset);

				tempRange.deleteContents();

				if (this.isTextEmptyNode(currentParentNode)) {
					currentParentNode.innerHTML = "";
					currentParentNode.appendChild(document.createElement("br"));
				}
				if (collapseDirection === "start") {
					this.backspace(document.createEvent("KeyboardEvent"));
				} 
				break;

			} else if (
				currentParentNode.contains(startNode) &&
				currentParentNode.contains(endNode)
			) {

				orgRange.deleteContents();

				if (this.isTextEmptyNode(currentParentNode)) {
					currentParentNode.innerHTML = "";
					currentParentNode.appendChild(document.createElement("br"));
				}

				// console.log(startNode);
				// console.log(endNode);

				if (collapseDirection === "end") {
					this.enter(document.createEvent("KeyboardEvent")); 
				}

				break;

			}

			currentParentNode = nextParentNode;
			nextParentNode = this.getNextAvailableNode(nextParentNode);

		}

	}

	/**
	 * Return true if the selection is empty.
	 */
	isEmpty()
	{
		if (document.getSelection().isCollapsed) {
			return true;
		} else {
			return false;
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
			return false;
		}
		var travelNode = node.firstChild;
		var nextNode = travelNode;

		while (1) {

			if (!travelNode) {
				return true;
			}

			nextNode = travelNode.nextSibling;

			if (travelNode.nodeType === 3 && travelNode.textContent === "") {
				node.removeChild(travelNode);
			} else if (travelNode.nodeName !== "BR") {
				return false;
			}

			travelNode = nextNode;

		}
	}

	isTextEmptyNode(node)
	{
		if (node.nodeType === 3) {
			return false;
		}

		if (
			node.textContent === ""
		) {
			return true;
		} else {
			return false;
		}
	}

	isAvailableEmptyNode(node) {
		if (node.nodeType === 3) {
			return false;
		}

		if (
			node.textContent === ""
		) {
			return true;
		} else {
			return false;
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
			return true;
		} else {
			return false;
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
			return true;
		} else {
			return false;
		}
	}

	isBold(node)
	{
		if (!node) {
			return false;
		} else if (
			node.nodeName === 'B' ||
			node.nodeName === 'STRONG'
		) {
			return true;
		} else {
			return false;
		}
	}

	isItalics(node)
	{
		if (!node) {
			return false;
		} else if (
			node.nodeName === 'I' ||
			node.nodeName === 'EM'
		) {
			return true;
		} else {
			return false;
		}
	}

	isStrike(node)
	{
		if (!node) {
			return false;
		} else if (node.nodeName === 'STRIKE') {
			return true;
		} else {
			return false;
		}
	}

	isUnderline(node)
	{
		if (!node) {
			return false;
		} else if (node.nodeName === 'U') {
			return true;
		} else {
			return false;
		}
	}

	isLink(node)
	{
		if (!node) {
			return false;
		} else if (node.nodeName === 'A') {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Determine if the given node is a paragraph node which Povium understands.
	 * @param {Node} node
	 */
	isParagraph(node)
	{
		if (!node) {
			return false;
		} else if (node.nodeName === 'P') {
			return true;
		} else {
			return false;
		}
	}

	isHeading(node)
	{
		if (!node) {
			return false;
		} else if (
			node.nodeName === 'H1' ||
			node.nodeName === 'H2' ||
			node.nodeName === 'H3' ||
			node.nodeName === 'H4' ||
			node.nodeName === 'H5' ||
			node.nodeName === 'H6'
		) {
			return true;
		} else {
			return false;
		}
	}

	isList(node)
	{
		if (!node) {
			return false;
		} else if (
			node.nodeName === 'OL' ||
			node.nodeName === 'UL'
		) {
			return true;
		} else {
			return false;
		}
	}

	isListItem(node)
	{
		if (!node) {
			return false;
		} else if (node.nodeName === 'LI') {
			return true;
		} else {
			return false;
		}
	}

	isBlockquote(node)
	{
		if (!node) {
			return false;
		} else if (node.nodeName === 'BLOCKQUOTE') {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns true if the node is an available image block.
	 * @param {HTMLElement} node 
	 */
	isImageBlock(node)
	{
		if (!node) {
			return false;
		} else if (node.nodeName === 'FIGURE' && node.classList && node.classList.contains('image')) {
			return true;
		} else {
			return false;
		}
	}

	isImageCaption(node) {
		if (!node) {
			return false;
		} else if (node.nodeName === 'FIGCAPTION') {
			return true;
		} else {
			return false;
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
			return true;
		} else {
			return false;
		}
	}

	isAvailableChildNode(node)
	{
		if (
			this.isListItem(node) ||
			this.isImageCaption(node)
		) {
			return true;
		} else {
			return false;
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
		var travelNode = node;
		var returnNode = null;
		if (!node) {
			return null;
		}

		if (firstOrLast === "first") {
			while (1) {
				if (travelNode === null) {
					break;
				} else if (travelNode.nodeType === 3) {
					returnNode = travelNode;
					break;
				} else {
					travelNode = travelNode.firstChild;
				}
			}
		} else if (firstOrLast === "last") {
			while (1) {
				if (travelNode === null) {
					break;
				} else if (travelNode.nodeType === 3) {
					returnNode = travelNode;
					break;
				} else {
					travelNode = travelNode.lastChild;
				}
			}
		} else {
			console.error("Second parameter must be 'first' or 'last'.");
		}

		return returnNode;
		
	}

	// getSelectionPosition(customRange = null)
	// {

	// 	var orgRange;

	// 	if (customRange) {
	// 		orgRange = customRange;
	// 	} else {
	// 		orgRange = this.getRange();
	// 	}

	// 	if (!orgRange) {
	// 		return false;
	// 	}

	// 	var startNode   = orgRange.startContainer;
	// 	var startOffset = orgRange.startOffset;
	// 	var endNode     = orgRange.endContainer;
	// 	var endOffset   = orgRange.endOffset;


	// 	var travelNode;
	// 	var isStart = false;
	// 	var isEnd   = false;


	// 	travelNode = startNode.previousSibling;

	// 	while (1) {
	// 		if (!travelNode && startOffset === 0) {
	// 			isStart = true;
	// 			break;
	// 		} else if (!travelNode) {
	// 			break;
	// 		} else if (travelNode.textContent === "") {
	// 			travelNode = travelNode.previousSibling;
	// 		} else {
	// 			break;
	// 		}
	// 	}



	// 	travelNode = endNode.nextSibling;

	// 	while (1) {
	// 		if (!travelNode && endOffset === endNode.textContent.length) {
	// 			isEnd = true;
	// 			break;
	// 		} else if (!travelNode) {
	// 			break;
	// 		} else if (travelNode.textContent === "") {
	// 			travelNode = travelNode.nextSibling;
	// 		} else {
	// 			break;
	// 		}
	// 	}


	// 	if (startNode === endNode && this.isEmptyNode(startNode)) {
	// 		isEnd = true;
	// 	}

	// 	if (isStart) {
	// 		return 1;
	// 	} else if (isEnd) {
	// 		return 3;
	// 	} else {
	// 		return 2;
	// 	}

	// }

	getSelectionPositionInParagraph(customRange = null)
	{
		var orgRange;

		if (customRange) {
			orgRange = customRange;
		} else {
			orgRange = this.getRange();
		}

		if (!orgRange) {
			return false;
		}

		var startNode   = orgRange.startContainer;
		var startOffset = orgRange.startOffset;
		var endNode     = orgRange.endContainer;
		var endOffset   = orgRange.endOffset;


		var travelNode, parentNode;
		var isStart = false;
		var isEnd   = false;


		parentNode = startNode.parentElement;
		travelNode = startNode;
		
		if (startOffset === 0) {
			while (1) {
				if (
					this.isAvailableParentNode(travelNode) ||
					this.isAvailableChildNode(travelNode)
				) {
					isStart = true;
					break;
				} else if (travelNode.previousSibling) {
					if (travelNode.previousSibling.textContent === "" || travelNode.previousSibling.nodeName === "BR") {
						travelNode = travelNode.previousSibling;
					} else {
						isStart = false;
						break;
					}
				} else {
					travelNode = travelNode.parentElement;
				}
			}
		}
		


		parentNode = endNode.parentElement;
		travelNode = endNode;
		if (endOffset === endNode.textContent.length) {
			while (1) {
				if (
					this.isAvailableParentNode(travelNode) ||
					this.isAvailableChildNode(travelNode)
				) {
					isEnd = true;
					break;
				} else if (travelNode.nextSibling) {
					if (travelNode.nextSibling.textContent === "" || travelNode.nextSibling.nodeName === "BR") {
						travelNode = travelNode.nextSibling;
					} else {
						isEnd = false;
						break;
					}
				} else {
					travelNode = travelNode.parentElement;
				}
			}
		}

		if (startNode === endNode && this.isEmptyNode(startNode)) {
			isStart = false;
			isEnd = true;
		}

		if (isStart) {
			return 1;
		} else if (isEnd) {
			return 3;
		} else {
			return 2;
		}
	}



	// Getters

	
	/**
	 * @return {Range}
	 */
	getRange()
	{
		if (window.getSelection().rangeCount > 0) {
			// let rangeCount = window.getSelection().rangeCount;
			return window.getSelection().getRangeAt(0);
		} else {
			return null;
		}
	}

	/**
	 * Returns an array of all available nodes within the selection.
	 * @return {Array.<HTMLElement>}
	 */
	getAllNodesInSelection()
	{

		// let travelNode = this.getRange() ? this.getRange().startContainer : null;
		let travelNode;
		let nodes = [];

		for (let i = 0; i < window.getSelection().rangeCount; i++) {

			travelNode = window.getSelection().getRangeAt(i).startContainer;

			while (1) {


				if (!travelNode) {
					break;
				} else if (this.isAvailableParentNode(travelNode)) {
					nodes.push(travelNode);
					if (travelNode.contains(this.getRange().endContainer)) {
						break;
					} else {
						travelNode = travelNode.nextElementSibling;
					}
					
				} else {
					travelNode = travelNode.parentElement;
				}

			}

		}

		return nodes;

	}

	getPreviousAvailableNode(node)
	{
		var previousNode = node;
		var travelNode = node.previousSibling;
		var returnNode = null;
		while (1) {
			if (travelNode === null) {
				if (this.isAvailableChildNode(previousNode)) {
					travelNode = previousNode.parentNode.previousSibling;
					previousNode = travelNode;
				} else {
					break;
				}
			} else if (
				this.isAvailableParentNode(travelNode) ||
				this.isAvailableChildNode(travelNode)
			) {
				// Find the available node
				if (this.isList(travelNode)) {
					var itemNodes = travelNode.querySelectorAll("LI");
					travelNode = itemNodes[itemNodes.length - 1];
				}
				returnNode = travelNode;
				break;
			} else {
				travelNode = travelNode.previousSibling;
			}
		}

		return returnNode;
	}

	getNextAvailableNode(node)
	{
		var previousNode = node;
		var travelNode = node.nextSibling;
		var returnNode = null;
		while (1) {
			if (travelNode === null) {
				if (this.isAvailableChildNode(previousNode)) {
					travelNode = previousNode.parentNode.nextSibling;
					previousNode = travelNode;
				} else {
					break;
				}
			} else if (
				this.isAvailableParentNode(travelNode) ||
				this.isAvailableChildNode(travelNode)
			) {
				// Find the available node
				if (this.isList(travelNode)) {
					travelNode = travelNode.querySelectorAll("LI")[0];
				}
				returnNode = travelNode;
				break;
			} else {
				travelNode = travelNode.nextSibling;
			}
		}

		return returnNode;
	}

	getNodeInSelection()
	{

		var range = this.getRange();
		if (!range) {
			return;
		}
		var travelNode = this.getRange().startContainer;
		if (travelNode === null) {
			return null;
		}

		while (1) {
			if (travelNode === null) {
				return null;
			} else if (
				this.isAvailableParentNode(travelNode) ||
				this.isAvailableChildNode(travelNode)
			) {
				return travelNode;
			} else {
				travelNode = travelNode.parentNode;
			}
		}

	}

}