export default class DOMManager {

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
		this.paragraph = editorDOM.querySelector('#p');
		this.heading1 = editorDOM.querySelector('#h1');
		this.heading2 = editorDOM.querySelector('#h2');
		this.heading3 = editorDOM.querySelector('#h3');

		this.boldButton = editorDOM.querySelector('#bold');
		this.italicButton = editorDOM.querySelector('#italic');
		this.underlineButton = editorDOM.querySelector('#underline');
		this.strikeButton = editorDOM.querySelector('#strike');

		this.alignLeft = editorDOM.querySelector('#align-left');
		this.alignCenter = editorDOM.querySelector('#align-center');
		this.alignRight = editorDOM.querySelector('#align-right');

		this.orderedList = editorDOM.querySelector('#ol');
		this.unorderedList = editorDOM.querySelector('#ul');

		this.link = editorDOM.querySelector('#link');
		this.blockquote = editorDOM.querySelector('#blockquote');

	}

	/**
	 * 
	 * @param  {String} tagName
	 * @return {HTMLElement}
	 */
	generateEmptyNode (tagName) {
		var elm = document.createElement(tagName);
		var br = document.createElement('br');
		elm.appendChild(br);
		return elm;
	}

	/**
	 * Merge two nodes into one node.
	 * @param {Node} firstNode 
	 * @param {Node} secondNode 
	 */
	mergeNodes (firstNode, secondNode) {
		
		if (firstNode === null || secondNode === null) {
			return;
		}

		var front = firstNode, back = secondNode;

		while (1) {

			if (front.nodeName !== back.nodeName) {
				break;
			}

			if (front.nodeType === 3) {

				

			} else {



			}

		}

	}

}