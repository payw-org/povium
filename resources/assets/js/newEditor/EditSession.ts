import { ErrorManager } from "./ErrorManager"
import NodeManager from "./NodeManager"
import PVMNode from "./PVMNode"
import PVMRange from "./PVMRange"

export default class EditSession {
	public static nodeList: PVMNode[]
	static editorDOM: HTMLElement
	static editorBody: HTMLElement
	static lastNodeID: number
	static currentState: {
		node: PVMNode
		textHTML: string
		range: PVMRange
	}

	constructor() {}

	public static init(editorDOM: HTMLElement) {
		this.editorDOM = editorDOM
		this.editorBody = editorDOM.querySelector("#editor-body")
		this.lastNodeID = 0
		this.nodeList = []
		this.currentState = {
			node: null,
			textHTML: null,
			range: null
		}
	}

	public static getAllNodes() {
		return EditSession.nodeList
	}

	public static validateData() {
		let nodeList = EditSession.nodeList
		let hasError = false

		nodeList.forEach(node => {
			if (node.id !== NodeManager.getNodeID(node.element)) {
				ErrorManager.showError("msnid")
				hasError = true
			}

			if (!node.element.isConnected) {
				ErrorManager.showError("mselm")
				hasError = true
			}
		})

		if (hasError) {
		} else {
			setTimeout(() => {
				this.validateData()
			}, 3000)
		}
	}
}
