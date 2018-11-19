import { AT } from "./config/AvailableTypes"

export default class PVMNode {
	id: number
	type: string
	parentType: string
	nextSibling: PVMNode
	previousSibling: PVMNode
	isConnected: boolean = false
	element: HTMLElement
	textElement: HTMLElement

	constructor() {}

	setInnerHTML(html: string) {
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

	isSameAs(node: PVMNode) {
		return this.id === node.id
	}

	replaceElement(elm: HTMLElement) {
		this.element = elm
		if (AT.textContained.includes(this.type)) {
			this.textElement = elm
		}
	}

	getTextContent() {
		if (this.textElement) {
			return this.textElement.textContent
		} else {
			return null
		}
	}
}
