import UndoManager from "./UndoManager"
import NodeManager from "./NodeManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"
import PopTool from "./PopTool"
import AJAX from "../AJAX"
import {AT} from "./config/AvailableTypes"
import { Example } from "./examples/example1"
import * as PostData from "./interfaces/PostData"

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

	}

	loadData() {

		EditSession.editorBody.innerHTML = ""

		let data: PostData.Frame = Example

		let contents = data.contents

		let firstChild

		for (let i = 0; i < contents.length; i++) {

			let block = contents[i]

			let parentType = null
			if ((<PostData.TextBlock>block).parentType) {
				parentType = (<PostData.TextBlock>block).parentType
			}

			// if (AT.textOnly.includes(block.type)) {
			
			if (PostData.isTextBlock(block)) {

				let html = ""
				
				for (let j = 0; j < block.data.length; j++) {

					let text     = block.data[j].data
					let htmlPart = text
					let style    = block.data[j].style

					if (style === "bold") {
						htmlPart = "<b>" + text + "</b>"
					} else if (style === "italic") {
						htmlPart = "<i>" + text + "</i>"
					} else if (style === "strikethrough") {
						htmlPart = "<strikethrough>" + text + "</strikethrough>"
					} else if (style === "underline") {
						htmlPart = "<u>" + text + "</u>"
					}

					html += htmlPart

				}

				let node = NodeManager.createNode(block.type, {
					parentType: parentType,
					html      : html
				})

				NodeManager.appendChild(node)

			} else if (PostData.isImageBlock(block)) {

				let html = ""

				for (let j = 0; j < block.caption.data.length; j++) {

					let text     = block.caption.data[j].data
					let htmlPart = text
					let style    = block.caption.data[j].style

					if (style === "bold") {
						htmlPart = "<b>" + text + "</b>"
					} else if (style === "italic") {
						htmlPart = "<i>" + text + "</i>"
					} else if (style === "strikethrough") {
						htmlPart = "<strikethrough>" + text + "</strikethrough>"
					} else if (style === "underline") {
						htmlPart = "<u>" + text + "</u>"
					}

					html += htmlPart

				}

				let node = NodeManager.createNode(block.type, {
					url : block.url,
					html: html,
					size: block.size
				})

				NodeManager.appendChild(node)

			}

		}

	}

}
