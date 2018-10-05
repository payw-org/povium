import SelectionManager from "./SelectionManager"
import PostEditor from "./PostEditor";

export default class DOMManager {

	/**
	 * Manages html DOM.
	 * @param {PostEditor} postEditor
	 */
	constructor (postEditor) {

		this.postEditor = postEditor

		this.editorDOM = postEditor.editorDOM

		this.newNodeID = 1 // Update this to the lasted genrated ID

		this.pHolder = document.createElement('p')
		this.pHolder.innerHTML = '<br>'

		// Editor body
		this.editorBody = this.editorDOM.querySelector('#editor-body')

		// Toolbar
		this.toolbar = this.editorDOM.querySelector('#editor-toolbar')

		// Toolbar buttons
		this.paragraph = this.editorDOM.querySelector('#p')
		this.heading1 = this.editorDOM.querySelector('#h1')
		this.heading2 = this.editorDOM.querySelector('#h2')
		this.heading3 = this.editorDOM.querySelector('#h3')

		this.boldButton = this.editorDOM.querySelector('#bold')
		this.italicButton = this.editorDOM.querySelector('#italic')
		this.underlineButton = this.editorDOM.querySelector('#underline')
		this.strikeButton = this.editorDOM.querySelector('#strike')

		this.alignLeft = this.editorDOM.querySelector('#align-left')
		this.alignCenter = this.editorDOM.querySelector('#align-center')
		this.alignRight = this.editorDOM.querySelector('#align-right')

		this.orderedList = this.editorDOM.querySelector('#ol')
		this.unorderedList = this.editorDOM.querySelector('#ul')

		this.link = this.editorDOM.querySelector('#link')
		this.blockquote = this.editorDOM.querySelector('#blockquote')

		this.popTool = this.editorDOM.querySelector('#poptool')

		this.imageTool = this.editorDOM.querySelector('#image-preference-view')

	}

	/**
	 * Insert a node before the referenced node.
	 * @param {Node} newChild
	 * @param {Node} refChild
	 * @param {Boolean} setCursor
	 * @param {Boolean} isLinked
	 */
	insertBefore(newChild, refChild, setCursor, isLinked)
	{
		
	}

	/**
	 * Insert a node after the referenced node.
	 * @param {Node} newChild
	 * @param {Node} refChild
	 * @param {Boolean} setCursor
	 * @param {Boolean} isLinked
	 */
	insertAfter(newChild, refChild, setCursor, isLinked)
	{

	}

	/**
	 *
	 * @param  {String} tagName
	 * @return {HTMLElement}
	 */
	generateEmptyNode(tagName, br = true) {
		var elm = document.createElement(tagName)

		// Give an id for the new node
		elm.setAttribute("name", this.newNodeID)
		this.newNodeID++

		if (br) {
			var br = document.createElement('br')
			elm.appendChild(br)
		}

		return elm
	}

	/**
	 * Generate image figure element
	 * @param {HTMLElement} image
	 */
	generateImageBlock(image) {
		let figure = document.createElement("FIGURE")
		figure.className = "image"
		figure.contentEditable = false
		let imageWrapper = document.createElement("DIV")
		imageWrapper.className = "image-wrapper"

		imageWrapper.appendChild(image)

		let imageCaption = document.createElement("FIGCAPTION")
		imageCaption.contentEditable = true

		figure.appendChild(imageWrapper)
		figure.appendChild(imageCaption)

	}

	togglePopTool() {
		if (document.getSelection().rangeCount === 0) {
			return
		}
		var range = document.getSelection().getRangeAt(0)
		if (range && !range.collapsed) {
			this.showPopTool()
		} else {
			this.popTool.classList.remove("active")
		}
	}

	showPopTool() {

		var range = document.getSelection().getRangeAt(0)

		var currentNode = this.postEditor.selManager.getNodeInSelection()

		if (
			this.postEditor.selManager.isListItem(currentNode)
		) {

			this.setPopToolMenu({
				heading: false,
				align: false,
				blockquote: false
			})

		} else if (
			this.postEditor.selManager.isBlockquote(currentNode)
		) {

			this.setPopToolMenu({
				heading: false,
				align: false
			})

		} else if (
			this.postEditor.selManager.isImageCaption(currentNode)
		) {

			this.setPopToolMenu({
				heading: false,
				align: false,
				blockquote: false
			})

		} else {

			this.setPopToolMenu({})

		}

		var left = range.getBoundingClientRect().left - document.querySelector("#post-editor").getBoundingClientRect().left + range.getBoundingClientRect().width / 2 - this.popTool.getBoundingClientRect().width / 2

		if (left < 10) {

			left = 10

		} else if (left + this.popTool.getBoundingClientRect().width > document.body.clientWidth - 10) {

			left = document.body.clientWidth - 10 - this.popTool.getBoundingClientRect().width

		}

		this.popTool.style.left = left + "px"

		var top = range.getBoundingClientRect().top - document.querySelector("#post-editor").getBoundingClientRect().top - this.popTool.getBoundingClientRect().height - 5

		if (top - window.pageYOffset < 10) {

			top = range.getBoundingClientRect().bottom - document.querySelector("#post-editor").getBoundingClientRect().top + 5

		}

		this.popTool.style.top = top + "px"


		this.popTool.classList.add("active")

	}

	hidePopTool() {
		this.popTool.classList.remove("active")
		setTimeout(() => {
			document.querySelector("#poptool .top-categories").classList.remove("hidden")
			document.querySelector("#poptool .title-style").classList.add("hidden")
			document.querySelector("#poptool .text-style").classList.add("hidden")
			document.querySelector("#poptool .align").classList.add("hidden")
			document.querySelector("#poptool .input").classList.add("hidden")
		}, 100)

	}

	setPopToolMenu(config) {

		// Link and text style is always available

		if ("heading" in config) {
			if (!config["heading"]) {
				document.querySelector("#poptool #pt-title-pack").classList.add("hidden")
			} else {
				document.querySelector("#poptool #pt-title-pack").classList.remove("hidden")
			}
		} else {
			document.querySelector("#poptool #pt-title-pack").classList.remove("hidden")
		}

		if ("align" in config) {
			if (!config["align"]) {
				document.querySelector("#poptool #pt-align-pack").classList.add("hidden")
			} else {
				document.querySelector("#poptool #pt-align-pack").classList.remove("hidden")
			}
		} else {
			document.querySelector("#poptool #pt-align-pack").classList.remove("hidden")
		}

		if ("blockquote" in config) {
			if (!config["blockquote"]) {
				document.querySelector("#poptool #pt-blockquote").classList.add("hidden")
			} else {
				document.querySelector("#poptool #pt-blockquote").classList.remove("hidden")
			}
		} else {
			document.querySelector("#poptool #pt-blockquote").classList.remove("hidden")
		}

	}

	/**
	 *
	 * @param {HTMLElement} imageBlock
	 */
	showImageTool(imageBlock) {

		this.imageTool.classList.add("active")

		this.imageTool.style.left =
		imageBlock.getBoundingClientRect().left +
		imageBlock.getBoundingClientRect().width / 2 -
		this.imageTool.getBoundingClientRect().width / 2
		+ "px"

		this.imageTool.style.top =
		- this.editorBody.getBoundingClientRect().top +
		imageBlock.getBoundingClientRect().top +
		imageBlock.getBoundingClientRect().height / 2 -
		this.imageTool.getBoundingClientRect().height / 2
		+ "px"

		// this.imageTool.style.top = imageBlock.getBoundingClientRect().top - this.editor.getBoundingClientRect().top + "px"
	}

	hideImageTool() {
		this.imageTool.classList.remove("active")
	}

}
