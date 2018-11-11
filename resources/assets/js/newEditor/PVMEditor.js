import UndoManager from "./UndoManager"
import NodeManager from "./NodeManager"
import EventManager from "./EventManager"
import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession"
import PopTool from "./PopTool"
import AJAX from "../AJAX"
import AT from "./config/AvailableTypes"

export default class PVMEditor {

	/**
	 *
	 * @param {Element} editorDOM HTMLElement that id="post-editor"
	 */
	constructor(editorDOM) {

		this.undoMan = new UndoManager()
		this.nodeMan = new NodeManager()
		this.eventMan = new EventManager()
		this.selMan = new SelectionManager()
		this.editSession = new EditSession(editorDOM)
		this.popTool = new PopTool(this.editSession)

		this.editSession.nodeMan = this.nodeMan

		this.popTool.nodeMan = this.nodeMan
		this.popTool.selMan = this.selMan
		this.popTool.undoMan = this.undoMan

		this.undoMan.nodeMan = this.nodeMan
		this.undoMan.eventMan = this.eventMan
		this.undoMan.selMan = this.selMan
		this.undoMan.editSession = this.editSession

		this.nodeMan.undoMan = this.undoMan
		this.nodeMan.eventMan = this.eventMan
		this.nodeMan.selMan = this.selMan
		this.nodeMan.editSession = this.editSession

		this.eventMan.undoMan = this.undoMan
		this.eventMan.nodeMan = this.nodeMan
		this.eventMan.selMan = this.selMan
		this.eventMan.editSession = this.editSession
		this.eventMan.popTool = this.popTool

		this.selMan.undoMan = this.undoMan
		this.selMan.nodeMan = this.nodeMan
		this.selMan.eventMan = this.eventMan
		this.selMan.editSession = this.editSession

		this.eventMan.attachEvents()

		this.loadData()

		this.editSession.validateData()

	}

	loadData() {

		this.editSession.editorBody.innerHTML = ""

		let data = require("./examples/example1.json")

		/**
		 * @type {Array}
		 */
		let contents = data.contents

		let firstChild

		for (let i = 0; i < contents.length; i++) {

			// console.log(contents[i])

			let parentType = null
			if (contents[i].type === "li") {
				parentType = contents[i].parentType
			}

			if (AT.textOnly.includes(contents[i].type)) {

				let html = ""
				
				for (let j = 0; j < contents[i].data.length; j++) {

					let text = contents[i].data[j].data
					let htmlPart = text
					let style = contents[i].data[j].style

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

				let node = this.nodeMan.createNode(contents[i].type, {
					parentType: parentType,
					html: html
				})

				this.nodeMan.appendChild(node)

			} else if (contents[i].type === "image") {

				let html = ""

				for (let j = 0; j < contents[i].caption.data.length; j++) {

					let text = contents[i].caption.data[j].data
					let htmlPart = text
					let style = contents[i].caption.data[j].style

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

				let node = this.nodeMan.createNode(contents[i].type, {
					url: contents[i].url,
					html: html,
					size: contents[i].size
				})

				this.nodeMan.appendChild(node)

			}

		}

	}

}
