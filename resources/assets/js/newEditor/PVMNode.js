import AT from "./config/AvailableTypes"

export default class PVMNode {

	constructor() {

		/**
		 * @type {number}
		 */
		this.id = null
		/**
		 * @type {string}
		 */
		this.type = null
		/**
		 * @type {string}
		 */
		this.parentType = null
		/**
		 * @type {PVMNode}
		 */
		this.nextSibling = null
		/**
		 * @type {PVMNode}
		 */
		this.previousSibling = null
		// /**
		//  * @type {string}
		//  */
		// this.textHTML = ""
		// /**
		//  * @type {string}
		//  */
		// this.rawText = ""
		/**
		 * @type {boolean}
		 */
		this.isConnected = false
		/**
		 * @type {HTMLElement}
		 */
		this.element = null
		/**
		 * @type {HTMLElement}
		 */
		this.textElement = null

	}

	setInnerHTML(html) {
		if (html === "") {
			html = "<br>"
		}

		this.textElement.innerHTML = html
	}

	fixEmptiness() {
		if (this.textElement.textContent === "") {
			this.textElement.innerHTML = "<br>"
		}
	}

	/**
	 *
	 * @param {PVMNode} node
	 */
	isSameAs(node) {
		return this.id === node.id
	}

	/**
	 * @param {Element} elm
	 */
	replaceElement(elm) {
		this.element = elm
		if (AT.textContained.includes(this.type)) {
			this.textElement = elm
		}
	}

	generateDOM() {

		let dom

		if (AT.textContained.includes(this.type)) {
			dom = document.createElement(this.type)
			if (this.rawText === "") {
				dom.innerHTML = "<br>"
			} else {
				dom.innerHTML = this.textHTML
			}
		}

		dom.setAttribute("data-ni", this.id)

		return dom

	}

	getTextContent() {
		return this.textElement.textContent
	}

}
