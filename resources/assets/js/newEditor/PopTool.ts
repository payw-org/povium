import { AT } from "./AvailableTypes"
import EditSession from "./EditSession"
import NodeManager from "./NodeManager"
import PVMRange from "./PVMRange"
import SelectionManager from "./SelectionManager"
import UndoManager from "./UndoManager"
import { SelectionChangeEvent } from "./EventManager"

export default class PopTool {
	public static pt: HTMLElement
	public static imageTool: HTMLElement
	private static tempLinkRange: PVMRange

	constructor() {}

	public static init() {
		this.pt = EditSession.editorDOM.querySelector("#poptool")
		// this.pt = EditSession.editorDOM.querySelector(".poptool-beta")
		this.imageTool = EditSession.editorDOM.querySelector(
			"#image-preference-view"
		)

		this.attachPopToolEvents()
	}

	public static attachPopToolEvents() {

		document.addEventListener("selectionChanged", (e: SelectionChangeEvent) => {
			if (e.detail.currentRange.collapsed) {
				this.hidePopTool()
			} else {
				this.showPopTool()
			}
		})

		document.addEventListener("selectionChanged", (e) => {
			this.togglePopTool()
		})
		let self = this
	
		window.addEventListener("resize", e => {
			this.showImageTool(document.querySelector(".image.node-selected"))
			this.showPopTool()
		})
	
		EditSession.editorBody.addEventListener("mouseup", e => {
			setTimeout(() => {
				this.togglePopTool()
			}, 0)
		})
	
		EditSession.editorBody.addEventListener("keyup", e => {
			let keyCode = e.which
			if (
				keyCode === 37 ||
				keyCode === 38 ||
				keyCode === 39 ||
				keyCode === 40
			) {
				this.togglePopTool()
			}
		})
	
		this.pt.querySelectorAll("button").forEach(elm => {
			elm.addEventListener("click", () => {
				let currentRange = SelectionManager.getCurrentRange()
				if (!currentRange.start.node && !currentRange.end.node) {
					this.hidePopTool()
				}
			})
		})
	
		// this.pt.querySelector("#pt-p").addEventListener('click', (e) => { this.postEditor.selManager.heading('P') })
		this.pt.querySelector("#pt-h1").addEventListener("click", e => {
			this.transformNodes("h1")
		})
		this.pt.querySelector("#pt-h2").addEventListener("click", e => {
			this.transformNodes("h2")
		})
		this.pt.querySelector("#pt-h3").addEventListener("click", e => {
			this.transformNodes("h3")
		})
		this.pt.querySelector("#pt-bold").addEventListener("click", e => {
			this.changeTextStyle("bold")
		})
		this.pt.querySelector("#pt-italic").addEventListener("click", e => {
			this.changeTextStyle("italic")
		})
		this.pt.querySelector("#pt-underline").addEventListener("click", e => {
			this.changeTextStyle("underline")
		})
		this.pt.querySelector("#pt-strike").addEventListener("click", e => {
			this.changeTextStyle("strikethrough")
		})
		this.pt.querySelector("#pt-alignleft").addEventListener("click", e => {
			this.align("left")
		})
		this.pt.querySelector("#pt-alignmiddle").addEventListener("click", e => {
			this.align("center")
		})
		this.pt.querySelector("#pt-alignright").addEventListener("click", e => {
			this.align("right")
		})
	
		this.pt.querySelector("#pt-title-pack").addEventListener("click", e => {
			this.pt.querySelector(".top-categories").classList.add("hidden")
			this.pt.querySelector(".title-style").classList.remove("hidden")
			this.showPopTool()
		})
		
	
		this.pt
			.querySelector("#pt-textstyle-pack")
			.addEventListener("click", e => {
				this.pt.querySelector(".top-categories").classList.add("hidden")
				this.pt.querySelector(".text-style").classList.remove("hidden")
				this.showPopTool()
			})
	
		this.pt.querySelector("#pt-align-pack").addEventListener("click", e => {
			this.pt.querySelector(".top-categories").classList.add("hidden")
			this.pt.querySelector(".align").classList.remove("hidden")
			this.showPopTool()
		})
	
		this.pt.querySelector("#pt-link").addEventListener("click", e => {
			this.pt.querySelector(".top-categories").classList.add("hidden")
			this.pt.querySelector(".input").classList.remove("hidden")
			this.showPopTool()
	
			this.tempLinkRange = SelectionManager.getCurrentRange()
	
			setTimeout(() => {
				(this.pt.querySelector(".pack.input input") as HTMLElement).focus()
			}, 0)
		})
	
		this.pt.querySelector(".pack.input input").addEventListener("keydown", function (e: KeyboardEvent) {
			if (e.keyCode === 13) {
				e.preventDefault()
				let url: string = this.value
				url = self.fixUrl(url)
				self.link(url)
				setTimeout(() => {
					this.value = ""
				}, 200);
			}
		})
	
		this.pt.querySelector("#pt-blockquote").addEventListener("click", e => {
			this.transformNodes("blockquote")
		})
	
		this.pt.querySelectorAll(".pack button").forEach(elm => {
			elm.addEventListener("click", () => {
				this.showPopTool()
			})
		})
	}

	public static fixUrl(url: string): string {
		if (url.match(/^https?:\/\//g)) {
			alert("alright")
		} else {
			url = "http://" + url
		}
		return url
	}

	public static togglePopTool() {
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

	public static showPopTool() {
		let sel = window.getSelection()
		if (sel.rangeCount === 0) {
			return
		}
		let range = document.getSelection().getRangeAt(0)

		let currentRange = SelectionManager.getCurrentRange()

		if (!currentRange) {
			return
		}

		let currentNode = currentRange.start.node

		if (!currentNode || currentRange.isCollapsed()) {
			this.hidePopTool()
			return
		}

		let isApplied: string[] = []
		let config = {
			heading: true,
			align: true,
			blockquote: true,
			isApplied: isApplied
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
		if (document.queryCommandState("strikethrough"))
			isApplied.push("strikethrough")

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

		if (currentNode.type === "li") {
			config.heading = false
			config.align = false
			config.blockquote = false
		} else if (currentNode.type === "blockquote") {
			config.heading = false
			config.align = false
		} else if (currentNode.type === "image") {
			config.heading = false
			config.align = false
			config.blockquote = false
		}

		this.setPopToolMenu(config)

		let left =
			range.getBoundingClientRect().left -
			document.querySelector("#post-editor").getBoundingClientRect().left +
			range.getBoundingClientRect().width / 2 -
			this.pt.getBoundingClientRect().width / 2

		if (left < 10) {
			left = 10
		} else if (
			left + this.pt.getBoundingClientRect().width >
			document.body.clientWidth - 10
		) {
			left =
				document.body.clientWidth - 10 - this.pt.getBoundingClientRect().width
		}

		this.pt.style.left = left + "px"

		let top =
			range.getBoundingClientRect().top -
			document.querySelector("#post-editor").getBoundingClientRect().top -
			this.pt.getBoundingClientRect().height -
			5

		if (top - window.pageYOffset < 10) {
			top =
				range.getBoundingClientRect().bottom -
				document.querySelector("#post-editor").getBoundingClientRect().top +
				5
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
	}) {
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
				if (ia === "h1")
					this.pt.querySelector("#pt-h1").classList.add("is-applied")
				if (ia === "h2")
					this.pt.querySelector("#pt-h2").classList.add("is-applied")
				if (ia === "h3")
					this.pt.querySelector("#pt-h3").classList.add("is-applied")
				if (ia === "blockquote")
					this.pt.querySelector("#pt-blockquote").classList.add("is-applied")
				if (ia === "bold")
					this.pt.querySelector("#pt-bold").classList.add("is-applied")
				if (ia === "italic")
					this.pt.querySelector("#pt-italic").classList.add("is-applied")
				if (ia === "underline")
					this.pt.querySelector("#pt-underline").classList.add("is-applied")
				if (ia === "strikethrough")
					this.pt.querySelector("#pt-strike").classList.add("is-applied")
				if (ia === "alignleft")
					this.pt.querySelector("#pt-alignleft").classList.add("is-applied")
				if (ia === "aligncenter")
					this.pt.querySelector("#pt-alignmiddle").classList.add("is-applied")
				if (ia === "alignright")
					this.pt.querySelector("#pt-alignright").classList.add("is-applied")
			})
		}
	}

	/**
	 * Changes the selection's text style.
	 */
	public static changeTextStyle(method: string) {
		// console.log(document.execCommand('bold', false))
		// this.itmotnTT("strong")
		// this.styleText("strong")

		let chunks = SelectionManager.getAllNodesInSelection("textContained")
		let currentRange = SelectionManager.getCurrentRange()

		let originalContents: string[] = []
		chunks.forEach(chunk => {
			originalContents.push(chunk.textElement.innerHTML)
		})

		// Execute styling
		document.execCommand(method, false)

		let actions = []

		for (let i = 0; i < chunks.length; i++) {
			if (chunks[i].textElement.innerHTML !== originalContents[i]) {
				actions.push({
					type: "textChange",
					targetNode: chunks[i],
					previousHTML: originalContents[i],
					nextHTML: chunks[i].textElement.innerHTML,
					previousRange: currentRange,
					nextRange: currentRange
				})
			}
		}
		UndoManager.record(actions)
	}

	public static transformNodes(tagName: string) {
		tagName = tagName.toLowerCase()

		let chunks = SelectionManager.getAllNodesInSelection()
		let currentRange = SelectionManager.getCurrentRange()
		let isAllAlreaySet = true
		let actions = []

		for (let i = 0; i < chunks.length; i++) {
			if (!AT.transformable.includes(chunks[i].type)) {
				continue
			}
			if (chunks[i].type !== tagName) {
				isAllAlreaySet = false
				// chunks[i].transformTo(tagName)
				let originalType = chunks[i].type
				let originalParentType = chunks[i].kind
				NodeManager.transformNode(chunks[i], tagName)
				actions.push({
					type: "transform",
					targetNode: chunks[i],
					previousType: originalType,
					previousParentType: originalParentType,
					nextType: tagName,
					nextParentType: null,
					previousRange: currentRange,
					nextRange: currentRange
				})
			}
		}

		if (isAllAlreaySet) {
			for (let i = 0; i < chunks.length; i++) {
				// chunks[i].transformTo("p")
				let originalType = chunks[i].type
				let originalParentType = chunks[i].kind
				NodeManager.transformNode(chunks[i], "p")
				actions.push({
					type: "transform",
					targetNode: chunks[i],
					previousType: originalType,
					previousParentType: originalParentType,
					nextType: "p",
					nextParentType: null,
					previousRange: currentRange,
					nextRange: currentRange
				})
			}
		}

		SelectionManager.setRange(currentRange)

		UndoManager.record(actions)
	}

	/**
	 * @param {string} dir "left" | "center" | "right"
	 */
	public static align(dir: string) {
		let chunks = SelectionManager.getAllNodesInSelection()
		let currentRange = EditSession.currentState.range
		let actions = [],
			previousDir
		for (let i = 0; i < chunks.length; i++) {
			if (!AT.alignable.includes(chunks[i].type)) {
				continue
			}
			previousDir = chunks[i].textElement.style.textAlign
			if (previousDir === "") previousDir = "left"
			chunks[i].textElement.style.textAlign = dir
			actions.push({
				type: "textAlign",
				targetNode: chunks[i],
				previousDir: previousDir,
				nextDir: dir,
				previousRange: currentRange,
				nextRange: currentRange
			})
		}
		UndoManager.record(actions)
	}

	public static link(url: string) {
		SelectionManager.setRange(this.tempLinkRange)
		document.execCommand("createLink", false, url)
		this.hidePopTool()
	}

	/**
	 * @param imageBlock ".image-wrapper"
	 */
	public static showImageTool(imageBlock: HTMLElement) {
		if (!imageBlock) {
			this.hideImageTool()
			return
		}
		let editorBody = EditSession.editorBody
		let imageFig = imageBlock.closest("figure.image")

		this.imageTool.classList.add("active")

		let img =  imageBlock.querySelector("img")

		this.imageTool.style.left =
			img.getBoundingClientRect().left +
			img.getBoundingClientRect().width / 2 -
			this.imageTool.getBoundingClientRect().width / 2 +
			"px"

		this.imageTool.style.top =
			-editorBody.getBoundingClientRect().top +
			img.getBoundingClientRect().top +
			img.getBoundingClientRect().height / 2 -
			this.imageTool.getBoundingClientRect().height / 2 +
			"px"
		

		this.imageTool.querySelectorAll("button").forEach(btn => {
			btn.classList.remove("is-applied")
		})
		if (imageFig.classList.contains("full")) {
			this.imageTool.querySelector("#full").classList.add("is-applied")
		} else if (imageFig.classList.contains("large")) {
			this.imageTool.querySelector("#large").classList.add("is-applied")
		} else if (imageFig.classList.contains("float-left")) {
			this.imageTool.querySelector("#float-left").classList.add("is-applied")
		} else {
			this.imageTool.querySelector("#fit").classList.add("is-applied")
		}

		// this.imageTool.style.top = imageBlock.getBoundingClientRect().top - this.editor.getBoundingClientRect().top + "px"
	}

	public static hideImageTool() {
		this.imageTool.classList.remove("active")
	}
}
