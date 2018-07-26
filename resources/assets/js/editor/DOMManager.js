import SelectionManager from "./SelectionManager";

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

		this.imageTool = editorDOM.querySelector('#image-preference-view');

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
			this.showPopTool();
		} else {
			this.popTool.classList.remove("active");
		}
	}

	showPopTool() {

		var range = document.getSelection().getRangeAt(0);

		
		// Set the available item
		var selManager = new SelectionManager(this);

		var currentNode = selManager.getNodeInSelection();

		if (
			selManager.isListItem(currentNode)
		) {

			this.setPopToolMenu({
				heading: false,
				align: false,
				blockquote: false
			});

		} else if (
			selManager.isBlockquote(currentNode)
		) {

			this.setPopToolMenu({
				heading: false,
				align: false
			});

		} else {

			this.setPopToolMenu({});

		}

		var left = range.getBoundingClientRect().left - document.querySelector("#post-editor").getBoundingClientRect().left + range.getBoundingClientRect().width / 2 - this.popTool.getBoundingClientRect().width / 2;

		if (left < 10) {

			left = 10;

		} else if (left + this.popTool.getBoundingClientRect().width > document.body.clientWidth - 10) {

			left = document.body.clientWidth - 10 - this.popTool.getBoundingClientRect().width;

		}

		this.popTool.style.left = left + "px";

		var top = range.getBoundingClientRect().top - document.querySelector("#post-editor").getBoundingClientRect().top - this.popTool.getBoundingClientRect().height - 5;

		if (top - window.pageYOffset < 10) {

			top = range.getBoundingClientRect().bottom - document.querySelector("#post-editor").getBoundingClientRect().top + 5;

		}

		this.popTool.style.top = top + "px";


		this.popTool.classList.add("active");

	}

	hidePopTool() {
		this.popTool.classList.remove("active");
		setTimeout(() => {
			document.querySelector("#poptool .top-categories").classList.remove("hidden");
			document.querySelector("#poptool .title-style").classList.add("hidden");
			document.querySelector("#poptool .text-style").classList.add("hidden");
			document.querySelector("#poptool .align").classList.add("hidden");
			document.querySelector("#poptool .input").classList.add("hidden");
		}, 100);
		
	}

	setPopToolMenu(config) {
		
		// Link and text style is always available

		if ("heading" in config) {
			if (!config["heading"]) {
				document.querySelector("#poptool #pt-title-pack").classList.add("hidden");
			} else {
				document.querySelector("#poptool #pt-title-pack").classList.remove("hidden");
			}
		} else {
			document.querySelector("#poptool #pt-title-pack").classList.remove("hidden");
		}

		if ("align" in config) {
			if (!config["align"]) {
				document.querySelector("#poptool #pt-align-pack").classList.add("hidden");
			} else {
				document.querySelector("#poptool #pt-align-pack").classList.remove("hidden");
			}
		} else {
			document.querySelector("#poptool #pt-align-pack").classList.remove("hidden");
		}

		if ("blockquote" in config) {
			if (!config["blockquote"]) {
				document.querySelector("#poptool #pt-blockquote").classList.add("hidden");
			} else {
				document.querySelector("#poptool #pt-blockquote").classList.remove("hidden");
			}
		} else {
			document.querySelector("#poptool #pt-blockquote").classList.remove("hidden");
		}

	}

	/**
	 * 
	 * @param {HTMLElement} imageBlock 
	 */
	showImageTool(imageBlock) {
		this.imageTool.classList.add("active");
		this.imageTool.style.left =
		imageBlock.getBoundingClientRect().left +
		imageBlock.getBoundingClientRect().width / 2 -
		this.imageTool.getBoundingClientRect().width / 2
		+ "px";
		this.imageTool.style.top =
		- this.editor.getBoundingClientRect().top +
		imageBlock.getBoundingClientRect().top +
		imageBlock.getBoundingClientRect().height / 2 -
		this.imageTool.getBoundingClientRect().height / 2
		+ "px";
	}

	hideImageTool() {
		this.imageTool.classList.remove("active");
	}

}