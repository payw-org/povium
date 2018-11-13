import PVMRange from "./PVMRange"
import PVMNode from "./PVMNode"
import { ErrorManager } from "./ErrorManager"
import NodeManager from "./NodeManager"
import AT from "./config/AvailableTypes"

export default class EditSession {

	editorDOM: HTMLElement
	editorBody: HTMLElement
	lastNodeID: number
	currentState: {
		node: PVMNode
		textHTML: string
		range: PVMRange
	}
	nodeList: PVMNode[]
	nodeMan: NodeManager

	constructor(editorDOM: HTMLElement) {

		

		this.editorDOM = editorDOM
		this.editorBody = editorDOM.querySelector("#editor-body")
		this.lastNodeID = 0
		this.currentState = {
			node: null,
			textHTML: null,
			range: null
		}
		this.nodeList = []
		this.nodeMan = null

	}

	getAllNodes() {
		return this.nodeList
	}

	validateData() {

		let nodeList = this.nodeList
		let hasError = false

		nodeList.forEach((node) => {
			if (node.id !== this.nodeMan.getNodeID(node.element)) {
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
			}, 3000);
		}

		

	}

}
