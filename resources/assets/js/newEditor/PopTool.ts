import SelectionManager from "./SelectionManager"
import NodeManager from "./NodeManager"
import EditSession from "./EditSession"
import {AT} from "./config/AvailableTypes"
import UndoManager from "./UndoManager"
import PVMRange from "./PVMRange";

export default class PopTool {

	public static pt       : HTMLElement
	public static imageTool: HTMLElement
	tempLinkRange          : PVMRange

	constructor()
	{
		
	}

	public static init() {
		this.pt        = EditSession.editorDOM.querySelector('#poptool')
		this.imageTool = EditSession.editorDOM.querySelector('#image-preference-view')
	}

	// Methods

	public static togglePopTool()
	{
		if (document.getSelection().rangeCount === 0) {
			return
		}
		var range = SelectionManager.getCurrentRange()
		if (range && !range.isCollapsed()) {
			this.showPopTool()
		} else {
			this.hidePopTool()
		}
	}

	public static showPopTool()
	{

		var range = document.getSelection().getRangeAt(0)

		let currentRange = SelectionManager.getCurrentRange()
		var currentNode  = SelectionManager.getCurrentNode()

		if (!currentNode) {
			this.hidePopTool()
			return
		}

		let isApplied: string[] = []
		let config    = {
			heading   : true,
			align     : true,
			blockquote: true,
			isApplied : isApplied
		}

		if (AT.headings.includes(currentNode.type)) {
			isApplied.push(currentNode.type)
		}

		if (currentNode.type === "blockquote") {
			isApplied.push(currentNode.type)
		}

		if (document.queryCommandState("bold")) isApplied.push("bold")
		if (document.queryCommandState("italic")) isApplied.push("italic")
		if (document.queryCommandState("underline")) isApplied.push("underline")
		if (document.queryCommandState("strikethrough")) isApplied.push("strikethrough")

		if (currentNode.textElement) {
			let textAlign = currentNode.textElement.style.textAlign
			if (textAlign === "" || textAlign === "left") {
				isApplied.push("alignleft")
			} else if (textAlign === "center") {
				isApplied.push("aligncenter")
			} else if (textAlign === "right") {
				isApplied.push("alignright")
			}
		}

		if (
			currentNode.type === "li"
		) {
			config.heading    = false
			config.align      = false
			config.blockquote = false
		} else if (
			currentNode.type === "blockquote"
		) {
			config.heading = false
			config.align   = false
		} else if (
			currentNode.type === "image"
		) {
			config.heading    = false
			config.align      = false
			config.blockquote = false
		}

		PopTool.setPopToolMenu(config)

		let left = range.getBoundingClientRect().left - document.querySelector("#post-editor").getBoundingClientRect().left + range.getBoundingClientRect().width / 2 - this.pt.getBoundingClientRect().width / 2

		if (left < 10) {

			left = 10

		} else if (left + this.pt.getBoundingClientRect().width > document.body.clientWidth - 10) {

			left = document.body.clientWidth - 10 - this.pt.getBoundingClientRect().width

		}

		this.pt.style.left = left + "px"

		let top = range.getBoundingClientRect().top - document.querySelector("#post-editor").getBoundingClientRect().top - this.pt.getBoundingClientRect().height - 5

		if (top - window.pageYOffset < 10) {

			top = range.getBoundingClientRect().bottom - document.querySelector("#post-editor").getBoundingClientRect().top + 5

		}

		this.pt.style.top = top + "px"


		this.pt.classList.add("active")

	}

	public static hidePopTool() {
		this.pt.classList.remove("active")
		setTimeout(() => {
			this.pt.querySelector(".top-categories").classList.remove("hidden")
			this.pt.querySelector(".title-style").classList.add("hidden")
			this.pt.querySelector(".text-style").classList.add("hidden")
			this.pt.querySelector(".align").classList.add("hidden")
			this.pt.querySelector(".input").classList.add("hidden")
			this.pt.querySelectorAll(".is-applied").forEach(function(element) {
				element.classList.remove(".is-applied")
			})
		}, 100)

	}

	public static setPopToolMenu(config: {
		heading?: boolean
		align?: boolean
		blockquote?: boolean
		isApplied?: string[]
	})
	{

		// Link and text style is always available

		if ("heading" in config) {
			if (!config["heading"]) {
				this.pt.querySelector("#pt-title-pack").classList.add("hidden")
			} else {
				this.pt.querySelector("#pt-title-pack").classList.remove("hidden")
			}
		} else {
			this.pt.querySelector("#pt-title-pack").classList.remove("hidden")
		}

		if ("align" in config) {
			if (!config["align"]) {
				this.pt.querySelector("#pt-align-pack").classList.add("hidden")
			} else {
				this.pt.querySelector("#pt-align-pack").classList.remove("hidden")
			}
		} else {
			this.pt.querySelector("#pt-align-pack").classList.remove("hidden")
		}

		if ("blockquote" in config) {
			if (!config["blockquote"]) {
				this.pt.querySelector("#pt-blockquote").classList.add("hidden")
			} else {
				this.pt.querySelector("#pt-blockquote").classList.remove("hidden")
			}
		} else {
			this.pt.querySelector("#pt-blockquote").classList.remove("hidden")
		}

		if ("isApplied" in config) {
			this.pt.querySelectorAll(".is-applied").forEach(function(element) {
				element.classList.remove("is-applied")
			})
			config["isApplied"].forEach((ia: string) => {
				if (ia === "h1") this.pt.querySelector("#pt-h1").classList.add("is-applied")
				if (ia === "h2") this.pt.querySelector("#pt-h2").classList.add("is-applied")
				if (ia === "h3") this.pt.querySelector("#pt-h3").classList.add("is-applied")
				if (ia === "blockquote") this.pt.querySelector("#pt-blockquote").classList.add("is-applied")
				if (ia === "bold") this.pt.querySelector("#pt-bold").classList.add("is-applied")
				if (ia === "italic") this.pt.querySelector("#pt-italic").classList.add("is-applied")
				if (ia === "underline") this.pt.querySelector("#pt-underline").classList.add("is-applied")
				if (ia === "strikethrough") this.pt.querySelector("#pt-strike").classList.add("is-applied")
				if (ia === "alignleft") this.pt.querySelector("#pt-alignleft").classList.add("is-applied")
				if (ia === "aligncenter") this.pt.querySelector("#pt-alignmiddle").classList.add("is-applied")
				if (ia === "alignright") this.pt.querySelector("#pt-alignright").classList.add("is-applied")
			})
		}

	}

	/**
	 * Changes the selection's text style.
	 */
	public static changeTextStyle(method: string)
	{

		// console.log(document.execCommand('bold', false))
		// this.itmotnTT("strong")
		// this.styleText("strong")

		let chunks       = SelectionManager.getAllNodesInSelection("textContained")
		let currentRange = SelectionManager.getCurrentRange()

		let originalContents: string[] = []
		chunks.forEach((chunk) => {
			originalContents.push(chunk.textElement.innerHTML)
		})

		// Execute styling
		document.execCommand(method, false)

		let actions = []

		for (let i = 0; i < chunks.length; i++) {
			if (chunks[i].textElement.innerHTML !== originalContents[i]) {
				actions.push({
					type         : "textChange",
					targetNode   : chunks[i],
					previousHTML : originalContents[i],
					nextHTML     : chunks[i].textElement.innerHTML,
					previousRange: currentRange,
					nextRange    : currentRange
				})
			}
		}
		UndoManager.record(actions)

	}

	public static transformNodes(tagName: string)
	{

		tagName = tagName.toLowerCase()

		let chunks         = SelectionManager.getAllNodesInSelection()
		let currentRange   = SelectionManager.getCurrentRange()
		let isAllAlreaySet = true
		let actions        = []

		for (let i = 0; i < chunks.length; i++) {
			if (!AT.transformable.includes(chunks[i].type)) {
				continue
			}
			if (chunks[i].type !== tagName) {
				isAllAlreaySet = false
				// chunks[i].transformTo(tagName)
				let originalType       = chunks[i].type
				let originalParentType = chunks[i].parentType
				NodeManager.transformNode(chunks[i], tagName)
				actions.push({
					type              : "transform",
					targetNode        : chunks[i],
					previousType      : originalType,
					previousParentType: originalParentType,
					nextType          : tagName,
					nextParentType    : null,
					previousRange     : currentRange,
					nextRange         : currentRange
				})
			}

		}

		if (isAllAlreaySet) {
			for (let i = 0; i < chunks.length; i++) {
				// chunks[i].transformTo("p")
				let originalType       = chunks[i].type
				let originalParentType = chunks[i].parentType
				NodeManager.transformNode(chunks[i], "p")
				actions.push({
					type              : "transform",
					targetNode        : chunks[i],
					previousType      : originalType,
					previousParentType: originalParentType,
					nextType          : "p",
					nextParentType    : null,
					previousRange     : currentRange,
					nextRange         : currentRange
				})
			}
		}

		SelectionManager.setRange(currentRange)

		UndoManager.record(actions)

	}

	/**
	 * @param {string} dir "left" | "center" | "right"
	 */
	public static align(dir: string)
	{
		let chunks       = SelectionManager.getAllNodesInSelection()
		let currentRange = EditSession.currentState.range
		let actions      = [], previousDir
		for (let i = 0; i < chunks.length; i++) {
			if (!AT.alignable.includes(chunks[i].type)) {
				continue
			}
			previousDir = chunks[i].textElement.style.textAlign
			if (previousDir === "") previousDir = "left"
			chunks[i].textElement.style.textAlign   = dir
			actions.push({
				type         : "textAlign",
				targetNode   : chunks[i],
				previousDir  : previousDir,
				nextDir      : dir,
				previousRange: currentRange,
				nextRange    : currentRange
			})
		}
		UndoManager.record(actions)
	}

	public static showImageTool(imageBlock: HTMLElement)
	{

		let editorBody = EditSession.editorBody

		PopTool.imageTool.classList.add("active")

		PopTool.imageTool.style.left = 
		imageBlock.getBoundingClientRect().left +
		imageBlock.getBoundingClientRect().width / 2 -
		PopTool.imageTool.getBoundingClientRect().width / 2
		+ "px"

		PopTool.imageTool.style.top = 
		- editorBody.getBoundingClientRect().top +
		imageBlock.getBoundingClientRect().top +
		imageBlock.getBoundingClientRect().height / 2 -
		PopTool.imageTool.getBoundingClientRect().height / 2
		+ "px"

		// PopTool.imageTool.style.top = imageBlock.getBoundingClientRect().top - this.editor.getBoundingClientRect().top + "px"
	}

	public static hideImageTool()
	{
		PopTool.imageTool.classList.remove("active")
	}

}
