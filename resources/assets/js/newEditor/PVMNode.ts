import { AT } from "./AvailableTypes"
import SelectionManager from "./SelectionManager"
import TypeChecker from "./TypeChecker"

export default class PVMNode {
	id: string
	type: string
	kind?: string
	align?: string
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

	setElement(elm: HTMLElement) {
		this.element = elm
		this.attachEventListeners()
	}

	attachEventListeners() {
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
		if (TypeChecker.isTextContained(this.type)) {
			this.textElement = elm
		} else {
			console.error("Type is not registered")
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
