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
		this.blockquote = this.toolbar.querySelector('#blockquote');

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