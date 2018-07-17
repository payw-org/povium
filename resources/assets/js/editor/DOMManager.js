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

		this.popTool = editorDOM.querySelector('#poptool');

	}

	/**
	 * 
	 * @param  {String} tagName
	 * @return {HTMLElement}
	 */
	generateEmptyNode(tagName) {
		var elm = document.createElement(tagName);
		var br = document.createElement('br');
		elm.appendChild(br);
		return elm;
	}

	togglePopTool() {
		if (document.getSelection().rangeCount === 0) {
			return;
		}
		var range = document.getSelection().getRangeAt(0);
		if (range && !range.collapsed) {
			this.popTool.classList.add("active");
			this.popTool.style.left = range.getBoundingClientRect().left - document.querySelector("#post-editor").getBoundingClientRect().left + range.getBoundingClientRect().width / 2 - this.popTool.getBoundingClientRect().width / 2  + "px";
			this.popTool.style.top = range.getBoundingClientRect().top - document.querySelector("#post-editor").getBoundingClientRect().top - this.popTool.getBoundingClientRect().height - 5 + "px";
		} else {
			this.popTool.classList.remove("active");
		}
	}

	showPopTool() {
		this.popTool.classList.add("active");
		this.popTool.style.left = range.getBoundingClientRect().left - document.querySelector("#post-editor").getBoundingClientRect().left + range.getBoundingClientRect().width / 2 - this.popTool.getBoundingClientRect().width / 2  + "px";
		this.popTool.style.top = range.getBoundingClientRect().top - document.querySelector("#post-editor").getBoundingClientRect().top - this.popTool.getBoundingClientRect().height - 5 + "px";
	}

	hidePopTool() {
		this.popTool.classList.remove("active");
	}

}