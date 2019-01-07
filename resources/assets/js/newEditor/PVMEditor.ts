import EditSession from "./EditSession"
import EventManager from "./EventManager"
import { Example } from "./examples/example1"
import * as PostData from "./interfaces/PostData"
import NodeManager from "./NodeManager"
import PopTool from "./PopTool"
import Converter from "./Converter"
import SelectionManager from "./SelectionManager";

export default class PVMEditor {
	/**
	 * @param editorDOM id = "post-editor"
	 */
	constructor(editorDOM: HTMLElement) {
		EditSession.init(editorDOM)
		PopTool.init()

		EventManager.attachEvents()

		this.loadData()

		EditSession.validateData()

		this.attachEventListeners()
	}

	loadData() {
		EditSession.editorBody.innerHTML = ""

		let pvmNodes = Converter.parse(Example)
		// console.log(pvmNodes)

		pvmNodes.forEach(node => {
			NodeManager.appendChild(node)
		})
	}

	attachEventListeners() {
	}
}
