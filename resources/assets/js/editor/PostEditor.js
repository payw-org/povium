import DOMManager from "./DOMManager"
import SelectionManager from "./SelectionManager"
import EventManager from "./EventManager"
import UndoManager from "./UndoManager"

export default class PostEditor {

	/**
	 * Creates a new PostEditor object.
	 * @param {HTMLElement} editorDOM
	 */
	constructor(editorDOM) {

		// Properties
		let self = this

		this.editorDOM = editorDOM

		/**
		 * @name domManager
		 * @type {DOMManager}
		 */
		this.domManager = new DOMManager(this)
		this.undoManager = new UndoManager(this)
		this.selManager = new SelectionManager(this)
		this.eventManager = new EventManager(this)


		document.execCommand("defaultParagraphSeparator", false, "p")

		// this.initEditor()

	}

	// Methods

	/**
	 * Initialize editor.
	 */
	initEditor() {

		// Fix flickering when add text style first time
		// in Chrome browser.
		var emptyNode = document.createElement('p')
		emptyNode.innerHTML = 'a'
		emptyNode.style.opacity = '0'
		this.domManager.editor.appendChild(emptyNode)
		var range = document.createRange()
		range.setStart(emptyNode.firstChild, 0)
		range.setEnd(emptyNode.firstChild, 1)
		this.selManager.replaceRange(range)
		document.execCommand('bold', false)
		this.domManager.editor.removeChild(emptyNode)
		document.getSelection().removeAllRanges()

		this.domManager.editor.normalize()

		this.domManager.editor.innerHTML = this.domManager.editor.innerHTML.replace(/\r?\n|\r/g, "")

		// if (this.isEmpty()) {
		// 	this.domManager.editor.innerHTML = ""
		// 	var emptyP = this.domManager.generateEmptyParagraph('p')
		// 	this.domManager.editor.appendChild(emptyP)

		// 	var range = document.createRange()
		// 	range.setStartBefore(emptyP)
		// 	range.collapse(true)

		// 	this.selManager.sel.removeAllRanges()
		// 	this.selManager.sel.addRange(range)
		// }

	}

	clearEditor() {

		this.domManager.editor.innerHTML = ""

	}


	/**
	 * Return true if the editor is empty.
	 */
	isEmpty() {
		let contentInside = this.domManager.editor.textContent
		let childNodesCount = this.selManager.getAllNodesInSelection().length
		if (contentInside === "" && childNodesCount < 1) {
			return true
		} else {
			return false
		}
	}

}
