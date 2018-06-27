class Snapshot {

	constructor () {

	}

	recordSnapshot () {

	}

	revertToSnapshot () {

	}

}

class DOMManager {

	/**
	 * Manages html DOM.
	 * @param {HTMLElement} editorDOM
	 */
	constructor (editorDOM) {

		this.pHolder = document.createElement('p');
		this.pHolder.innerHTML = '<br>';

		// Editor body
		this.editor = editorDOM.querySelector('#editor-body');

		// Toolbar
		this.toolbar = editorDOM.querySelector('#editor-toolbar');

		// Toolbar buttons
		this.body = this.toolbar.querySelector('#p');
		this.heading1 = this.toolbar.querySelector('#h1');
		this.heading2 = this.toolbar.querySelector('#h2');
		this.heading3 = this.toolbar.querySelector('#h3');

		this.boldButton = this.toolbar.querySelector('#bold');
		this.italicButton = this.toolbar.querySelector('#italic');
		this.underlineButton = this.toolbar.querySelector('#underline');
		this.strikeButton = this.toolbar.querySelector('#strike');

		this.alignLeft = this.toolbar.querySelector('#align-left');
		this.alignCenter = this.toolbar.querySelector('#align-center');
		this.alignRight = this.toolbar.querySelector('#align-right');

		this.orderedList = this.toolbar.querySelector('#ol');
		this.unorderedList = this.toolbar.querySelector('#ul');

		this.link = this.toolbar.querySelector('#link');

	}

	/**
	 * 
	 * @param  {String} tagName
	 * @return {HTMLElement}
	 */
	generateEmptyParagraph (tagName) {
		let elm = document.createElement(tagName);
		let br = document.createElement('br');
		elm.appendChild(br);
		return elm;
	}

}

class PostEditor {

	/**
	 * Creates a new PostEditor object.
	 * @param {HTMLElement} editorDOM
	 */
	constructor (editorDOM) {

		let self = this;

		this.domManager = new DOMManager(editorDOM);
		this.selManager = new SelectionManager(this.domManager);

		document.execCommand("defaultParagraphSeparator", false, "p");

		// Event Listeners

		this.domManager.editor.addEventListener('focusin', () => { this.onSelectionChanged(); });
		this.domManager.editor.addEventListener('keyup', (e) => {
			this.onKeyUp(e);
			this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('click', () => {
			this.onSelectionChanged();
		});

		this.domManager.editor.addEventListener('paste', (e) => { this.onPaste(e); });

		// Toolbar button events
		this.domManager.body.addEventListener('click', (e) => { this.selManager.heading('P'); });
		this.domManager.heading1.addEventListener('click', (e) => { this.selManager.heading('H1'); });
		this.domManager.heading2.addEventListener('click', (e) => { this.selManager.heading('H2'); });
		this.domManager.heading3.addEventListener('click', (e) => { this.selManager.heading('H3'); });

		this.domManager.boldButton.addEventListener('click', (e) => { this.selManager.bold(); });
		this.domManager.italicButton.addEventListener('click', (e) => { this.selManager.italic(); });
		this.domManager.underlineButton.addEventListener('click', (e) => { this.selManager.underline(); });
		this.domManager.strikeButton.addEventListener('click', (e) => { this.selManager.strike(); });

		this.domManager.alignLeft.addEventListener('click', (e) => { this.selManager.align('left'); });
		this.domManager.alignCenter.addEventListener('click', (e) => { this.selManager.align('center'); });
		this.domManager.alignRight.addEventListener('click', (e) => { this.selManager.align('right'); });

		this.domManager.orderedList.addEventListener('click', (e) => { this.selManager.list('OL'); });
		// this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('UL'); });

		this.initEditor();

	}

	// Events

	/**
	 *
	 * @param {KeyboardEvent} e
	 */
	onPaste (e) {

		let clipboardData, pastedData;

		e.stopPropagation();
		e.preventDefault();

		// Get data from clipboard and conver
		clipboardData = e.clipboardData || window.clipboardData;
		pastedData = clipboardData.getData('Text');

		this.selManager.paste(pastedData);

	}


	/**
	 * Fires when press keyboard inside the editor.
	 * @param {KeyboardEvent} e 
	 */
	onKeyUp (e) {
		
	}


	onSelectionChanged () {

		// if (this.isEmpty()) {

		// 	console.log('what');
		// 	this.clearEditor();
		// 	var p = this.domManager.generateEmptyParagraph('p');
		// 	var range = document.createRange();
		// 	range.setStart(p, 0);
		// 	this.domManager.editor.appendChild(p);
		// 	this.selManager.replaceRange(range);
		// 	console.log('Oops, editor seems empty. Now reset it to initial stat.');
		
		// }

		// If the selection is not in the available elements
		// adjust it.
		var range = this.selManager.getRange();
		var startNode = range.startContainer;
		var startOffset = range.startOffset;
		var endNode = range.endContainer;
		var endOffset = range.endOffset;

		var target;

		var newRange = document.createRange();
		newRange.setStart(startNode, startOffset);
		newRange.setEnd(endNode, endOffset);

		var isChanged = false;

		if (startNode.id === 'editor-body') {

			target = startNode.firstElementChild;

			for (var i = 0; i < startOffset; i++) {
				target = target.nextElementSibling;
			}


			newRange.setStartBefore(target.firstChild);

			isChanged = true;
			
		}

		if (endNode.id === 'editor-body') {

			target = endNode.firstChild;

			for (var i = 0; i < endOffset - 1; i++) {
				target = target.nextElementSibling;
			}

			newRange.setEndAfter(target.lastChild);

			isChanged = true;
			
		}


		if (isChanged) {
			this.selManager.replaceRange(newRange);
			console.log(newRange);
		}
		

	}


	// Methods

	/**
	 * Initialize editor.
	 */
	initEditor () {

		// Fix flickering when add text style first time
		// in Chrome browser.
		var emptyNode = document.createElement('p');
		emptyNode.innerHTML = 'a';
		emptyNode.style.opacity = '0';
		this.domManager.editor.appendChild(emptyNode);
		var range = document.createRange();
		range.setStart(emptyNode.firstChild, 0);
		range.setEnd(emptyNode.firstChild, 1);
		this.selManager.replaceRange(range);
		document.execCommand('bold', false);
		this.domManager.editor.removeChild(emptyNode);

		// if (this.isEmpty()) {
		// 	this.domManager.editor.innerHTML = "";
		// 	var emptyP = this.domManager.generateEmptyParagraph('p');
		// 	this.domManager.editor.appendChild(emptyP);

		// 	var range = document.createRange();
		// 	range.setStartBefore(emptyP);
		// 	range.collapse(true);

		// 	this.selManager.sel.removeAllRanges();
		// 	this.selManager.sel.addRange(range);
		// }
		
	}

	clearEditor () {

		this.domManager.editor.innerHTML = "";

	}
	

	/**
	 * Return true if the editor is empty.
	 */
	isEmpty () {
		let contentInside = this.domManager.editor.textContent;
		let childNodesCount = this.selManager.getNodesInSelection().length;
		if (contentInside === "" && childNodesCount < 1) {
			return true;
		} else {
			return false;
		}
	}

}

class SelectionManager {

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

		var chunks = this.getNodesInSelection();
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
		let chunks = this.getNodesInSelection();

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

			let newParagraph = document.createElement(type);
			
			var child;
			while (child = chunks[i].firstChild) {
				newParagraph.appendChild(child);
			}

			if (chunks[i] === startNode) {
				startNode = newParagraph;
			}

			if (chunks[i] === endNode) {
				endNode = newParagraph;
			}

			this.domManager.editor.replaceChild(newParagraph, chunks[i]);

			// this.changeNodeName(chunks[i], type);

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

		let chunks = this.getNodesInSelection();
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

		this.sel.getRangeAt(0).insertNode(listElm);

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

		console.log(startNode);

		var keepRange = document.createRange();
		keepRange.setStart(startNode, startOffset);
		keepRange.setEnd(endNode, endOffset);

		this.replaceRange(keepRange);

	}

	link (uri) {
		document.execCommand('createLink', false, uri);
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
		this.sel.removeAllRanges();
	}

	/**
	 * 
	 * @param {Range} range 
	 */
	replaceRange (range) {
		this.sel.removeAllRanges();
		this.sel.addRange(range);
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

		var tempNode;
		var newNode = document.createElement(newNodeName);

		while (tempNode = targetNode.firstChild) {
			newNode.appendChild(tempNode);
		}

		var range = this.getRange();
		console.log(range.cloneRange());
		if (range !== null) {

			if (targetNode === range.startContainer) {
				console.log('1');
				range.setStart(newNode, range.startOffset);
				this.replaceRange(range);
			}

			if (targetNode === range.endContainer) {
				console.log('2');
				range.setEnd(newNode, range.endOffset);
				this.replaceRange(range);
			}

		}

		if (this.domManager.editor.contains(targetNode)) {
			this.domManager.editor.replaceChild(newNode, targetNode);
			console.log(range);
			this.replaceRange(range);
		} else {
			return newNode;
		}

	}

	/**
	 * Update selection information.
	 */
	updateSelection () {


	}

	fixSelection () {
		
		
	}

	/**
	 * Split text nodes based on the selection.
	 */
	splitTextNode () {
		if (this.startOffset > 0) {
			console.log(this.startNode);
		}
	}

	/**
	 * Remove selection.
	 */
	removeSelection () {
		
	}

	/**
	 * Return true if the selection is empty.
	 */
	isEmpty () {
		if (this.sel.isCollapsed) {
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




	// Getters


	/**
	 * @return {Selection}
	 */
	getSelection () {
		return this.sel;
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
	getNodesInSelection () {

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

	getCursorPosInParagraph () {
		if (this.startOffset === 0) {
			// If the selection is on the beginning
			return 1;
		} else {
			return
		}
	}

}

const editor = new PostEditor(document.querySelector('#post-editor'));

// var a = document.createElement('h1').nodeName;
// console.log(a);

document.querySelector('#log-range').addEventListener('click', function () {

	var sel = window.getSelection();

	if (sel.rangeCount === 0) {
		return;
	}

	var range = sel.getRangeAt(0);

	console.log(range.startContainer, range.startOffset);
	console.log(range.endContainer, range.endOffset);

});