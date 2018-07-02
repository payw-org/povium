export default class SelectionManager {

	/**
	 * 
	 * @param {DOMManager} domManager 
	 */
	constructor (domManager) {

		this.sel = document.getSelection();
		this.range;
		this.startNode;
		this.startOffset;
		this.endNode;
		this.endOffset;

		this.domManager = domManager;

	}

	// Events



	// Methods

	/**
	 * Align the selected paragraph.
	 * @param {String} direction
	 * Left, Center, Right
	 */
	align (direction) {

		// document.execCommand('styleWithCSS', true);
		// document.execCommand(direction, false);

		var chunks = this.getAllNodesInSelection();
		var node;

		for (var i = 0; i < chunks.length; i++) {

			if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
				console.warn('The node is not a paragraph nor a heading.')
				continue;
			}

			chunks[i].style.textAlign = direction;

		}
		
	}


	/**
	 * Make the selection bold.
	 */
	bold () {
		document.execCommand('bold', false);
	}

	/**
	 * Make the selection italics.
	 */
	italic () {
		document.execCommand('italic', false);
	}

	underline () {
		document.execCommand('underline', false);
	}

	strike () {
		document.execCommand('strikeThrough', false);
	}

	/**
	 * 
	 * @param {string} type 
	 */
	heading (type) {

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

			if (chunks[i].nodeName === type) {
				continue;
			}

			if (chunks[i].textContent === "") {
				continue;
			}

			if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
				console.warn('The node is not a paragraph nor a heading.')
				continue;
			}

			this.changeNodeName(chunks[i], type);

			// let newParagraph = document.createElement(type);
			
			// var child;
			// while (child = chunks[i].firstChild) {
			// 	newParagraph.appendChild(child);
			// }

			// if (chunks[i] === startNode) {
			// 	startNode = newParagraph;
			// }

			// if (chunks[i] === endNode) {
			// 	endNode = newParagraph;
			// }

			// this.domManager.editor.replaceChild(newParagraph, chunks[i]);

			// this.changeNodeName(chunks[i], type);

		}

		// var keepRange = document.createRange();
		// keepRange.setStart(startNode, startOffset);
		// keepRange.setEnd(endNode, endOffset);

		// this.replaceRange(keepRange);

	}

	/**
	 * 
	 * @param {string} type 
	 */
	list (type) {

		// If one or more lists are
		// included in the selection,
		// add other chunks to the existing list.

		// If all selection is already a list
		// restore them to 'P' node.

		let orgRange = this.getRange();
		if (!orgRange) {
			return;
		}
		let startNode = orgRange.startContainer;
		let startOffset = orgRange.startOffset;
		let endNode = orgRange.endContainer;
		let endOffset = orgRange.endOffset;

		let chunks = this.getAllNodesInSelection();
		let listElm = document.createElement(type);
		var node;

		var unlockList = true;
		var recordList = [];

		for (var i = 0; i < chunks.length; i++) {

			if (chunks[i].textContent === "") {
				continue;
			}

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

				this.domManager.editor.removeChild(chunks[i]);

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
				

				this.domManager.editor.removeChild(chunks[i]);

			}

		}

		if (listElm.childElementCount < 1) {
			return;
		}

		this.getRange().insertNode(listElm);

		if (unlockList) {

			var range = document.createRange();
			var itemNode, nextNode;
			var part1 = true, part2 = false, part3 = false;
			var part1ListElm = document.createElement('OL'), part3ListElm = document.createElement('OL');
			var part1ListElmInserted = false, part3ListElmInserted = false;
			var part3Will = false;

			range.setStartAfter(listElm);
			this.replaceRange(range);

			itemNode = listElm.firstChild;
			nextNode = itemNode;

			while (itemNode) {


				nextNode = itemNode.nextElementSibling;

				if (itemNode.nodeName !== "LI") {
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
					startNode = newParagraph;
				}
	
				if (itemNode === endNode) {
					endNode = newParagraph;
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

		var keepRange = document.createRange();
		keepRange.setStart(startNode, startOffset);
		keepRange.setEnd(endNode, endOffset);

		this.replaceRange(keepRange);

	}

	link (url) {
		document.execCommand('createLink', false, url);
	}

	blockquote () {

	}


	/**
	 * Deprecated
	 */
	backspace () {

		// this.range.deleteContents();

		// If the selection is collapsed
		// implement default delete action.
		if (this.isEmpty()) {
			console.log(this.startOffset);
			if (this.startOffset === 0) {
				// If the selection is on the beginning
				
			} else {
				if (this.startNode.nodeType === 3) {
					console.log(this.startNode);
					// TextNode
					var text = this.startNode.textContent;
					var suffixNode;
					var newRange = document.createRange();

					this.startNode.textContent
					= text.slice(0, this.startOffset - 1) + text.slice(this.startOffset, text.length);
					
					newRange.setEnd(this.startNode, this.startOffset - 1);
					newRange.collapse(false);
					newRange.insertNode((suffixNode = document.createTextNode(' ')));
					newRange.setStartAfter(suffixNode);

					console.log(this.startOffset);

					this.replaceRange(newRange);
					
				}
			}
		}
		

	}

	delete () {
		
	}

	enter () {

	}

	/**
	 * Paste refined data to the selection.
	 * @param {String} pastedData
	 */
	paste (pastedData) {

		let splitted = pastedData.split(/(?:\r\n|\r|\n)/g);

		var range = document.createRange();
		range = this.getRange();

		splitted.forEach( (paragraph, index) => {

			var addedNode;

			var line = paragraph;

			if (index === 0) {
				// line = line.replace(/\s/g, "&nbsp;");
				addedNode = document.createTextNode(line);
			} else {
				addedNode = document.createElement('p');
				line = line.replace(/\s/g, "&nbsp;");
				if (line === "") {
					line = "<br>";
				}
				addedNode.innerHTML = line;
			}

			range.insertNode(addedNode);

			range.setStartAfter(addedNode);

		});

		// console.log(splitted);

		// pastedData = pastedData.replace(/(?:\r\n|\r|\n)/g, '<br>');
 
	}



	clearRange () {
		document.getSelection().removeAllRanges();
	}

	/**
	 * 
	 * @param {Range} range 
	 */
	replaceRange (range) {
		document.getSelection().removeAllRanges();
		document.getSelection().addRange(range);
	}

	/**
	 * Replace the node if the node is inside the editor,
	 * else return the new node.
	 * @param {HTMLElement} targetNode An HTML element you want to change its node name.
	 * @param {String} newNodeName New node name for the target element.
	 */
	changeNodeName (targetNode, newNodeName) {

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
		

		// 2. Keep Range

		// 3. Keep style

	}

	/**
	 * Update selection information.
	 */
	updateSelection () {


	}

	fixSelection () {
		
		
	}

	splitElementNode () {

	}

	/**
	 * Split text nodes based on the selection.
	 */
	splitTextNode () {
		console.log('split');
		var range = this.getRange();
		if (!range) {
			return;
		}
		var startNode = range.startContainer;
		var startOffset = range.startOffset;
		

		if (startNode.nodeType === 3 && startOffset > 0) {
			startNode.splitText(startOffset);
		}

		range = this.getRange();
		var endNode = range.endContainer;
		var endOffset = range.endOffset;

		if (endNode.nodeType === 3 && endOffset < endNode.textContent.length) {
			endNode.splitText(endOffset);
		}
	}

	/**
	 * Remove selection.
	 */
	removeSelection () {
		this.getRange().deleteContents();
	}

	/**
	 * Return true if the selection is empty.
	 */
	isEmpty () {
		if (document.getSelection().isCollapsed) {
			return true;
		} else {
			return false;
		}
	}


	/**
	 * Determine if the given node is a paragraph node which Povium understands.
	 * @param {Node} node
	 */
	isParagraph (node) {
		if (!node) {
			return false;
		} else if (node.nodeName === 'P') {
			return true;
		} else {
			return false;
		}
	}

	isHeading (node) {
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

	isList (node) {
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

	isBlockquote (node) {
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
	isImageBlock (node) {
		if (!node) {
			return false;
		} else if (node.classList && node.classList.contains('image-block')) {
			return true;
		} else {
			return false;
		}
	}

	isAvailableNode (node) {
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

	getSelectionPosition () {
		var orgRange = this.getRange();
		var startNode = orgRange.startContainer;
		var startOffset = orgRange.startOffset;
		var endNode = orgRange.endContainer;
		var endOffset = orgRange.endOffset;

		if (!endNode.nextSibling && endNode.textContent.length === endOffset) {
			// console.log('end of the line');
			return 2;
		} else if (!startNode.previousSibling && startOffset === 0) {
			// console.log('start of the line');
			return 0;
		} else {
			// console.log('middle of the night');
			return 1;
		}
	}




	// Getters


	/**
	 * @return {Selection}
	 */
	getSelection () {
		return document.getSelection();
	}

	
	/**
	 * @return {Range}
	 */
	getRange () {
		if (document.getSelection().rangeCount > 0) {
			return document.getSelection().getRangeAt(0);
		} else {
			return null;
		}
	}

	/**
	 * Returns an array of all available nodes within the selection.
	 * @return {Array.<HTMLElement>}
	 */
	getAllNodesInSelection () {

		let travelNode = this.getRange() ? this.getRange().startContainer : null;
		let nodes = [];

		while (1) {


			if (!travelNode) {
				break;
			} else if (this.isAvailableNode(travelNode)) {
				nodes.push(travelNode);
				if (travelNode.contains(this.getRange().endContainer)) {
					break;
				} else {
					travelNode = travelNode.nextElementSibling;
				}
				
			} else {
				travelNode = travelNode.parentElement;
			}
			
			// if (!travelNode || travelNode.nodeName === 'BODY') {

			// 	break;

			// } else if (travelNode.id === 'editor-body') {

			// 	travelNode = travelNode.firstChild;

			// } else if (this.isAvailableNode(travelNode)) {
			// 	nodes.push(travelNode);
				
			// 	if (travelNode.contains(this.getRange().endContainer)) {
			// 		break;
			// 	} else {
			// 		travelNode = travelNode.nextElementSibling;
			// 	}

			// } else if (travelNode.nextElementSibling === null) {
			// 	travelNode = travelNode.parentNode;
			// } else {
			// 	travelNode = travelNode.nextElementSibling;
			// }

		}

		return nodes;

	}

	getNodeInSelection () {

		var travelNode = this.getRange().startContainer;
		if (!travelNode) {
			return;
		}

		while (1) {
			if (this.isAvailableNode(travelNode)) {
				return travelNode;
				break;
			} else {
				travelNode = travelNode.parentElement;
			}
		}

	}

	getCursorPosInParagraph () {
		if (this.startOffset === 0) {
			// If the selection is on the beginning
			return 1;
		} else {
			return
		}
	}

}