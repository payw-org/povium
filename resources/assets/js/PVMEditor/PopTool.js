import PVMEditSession from "./PVMEditSession"
import PVMSelection from "./PVMSelection"
import PVMRange from "./PVMRange"
import AN from "./config/availableNodes"

export default class PopTool {

	/**
	 * 
	 * @param {PVMEditSession} editSession 
	 */
	constructor(editSession)
	{
		this.session = editSession
		this.sel = this.session.selection
		this.nodeMan = editSession.pvmNodeManager
		this.dom = this.session.container.querySelector('#poptool')
		this.imageTool = this.session.container.querySelector('#image-preference-view')

		this.attachEvents()

		this.tempLinkRange
	}

	// Methods

	attachEvents()
	{

		let self = this

		this.session.editorBody.addEventListener("mousedown", (e) => {
			if (!this.dom.contains(e.target)) {
				this.hidePopTool()
			}
		})

		this.session.editorBody.addEventListener("mouseup", (e) => {
			setTimeout(() => {
				this.togglePopTool()
			}, 0);
			
		})

		this.session.editorBody.addEventListener("keydown", (e) => {
			let keyCode = e.which
			if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
				this.togglePopTool()
			}
		})

		this.dom.querySelectorAll("button").forEach((elm) => {
			elm.addEventListener("click", () => {
				let currentRange = this.sel.getCurrentRange()
				if (!currentRange.start.nodeID && !currentRange.end.nodeID) {
					this.hidePopTool()
				}
			})
		})

		// this.pt.querySelector("#pt-p").addEventListener('click', (e) => { this.postEditor.selManager.heading('P') })
		this.dom.querySelector("#pt-h1").addEventListener('click', (e) => { this.transformNodes("H1") })
		this.dom.querySelector("#pt-h2").addEventListener('click', (e) => { this.transformNodes("H2") })
		this.dom.querySelector("#pt-h3").addEventListener('click', (e) => { this.transformNodes("H3") })
		this.dom.querySelector("#pt-bold").addEventListener('click', (e) => { this.changeTextStyle("bold") })
		this.dom.querySelector("#pt-italic").addEventListener('click', (e) => { this.changeTextStyle("italic") })
		this.dom.querySelector("#pt-underline").addEventListener('click', (e) => { this.changeTextStyle("underline") })
		this.dom.querySelector("#pt-strike").addEventListener('click', (e) => { this.changeTextStyle("strikeThrough") })
		this.dom.querySelector("#pt-alignleft").addEventListener('click', (e) => { this.align("left") })
		this.dom.querySelector("#pt-alignmiddle").addEventListener('click', (e) => { this.align("center") })
		this.dom.querySelector("#pt-alignright").addEventListener('click', (e) => { this.align("right") })

		this.dom.querySelector("#pt-title-pack").addEventListener('click', (e) => {

			this.dom.querySelector(".top-categories").classList.add("hidden")
			this.dom.querySelector(".title-style").classList.remove("hidden")
			this.showPopTool()

		})

		this.dom.querySelector("#pt-textstyle-pack").addEventListener('click', (e) => {

			this.dom.querySelector(".top-categories").classList.add("hidden")
			this.dom.querySelector(".text-style").classList.remove("hidden")
			this.showPopTool()

		})

		this.dom.querySelector("#pt-align-pack").addEventListener('click', (e) => {

			this.dom.querySelector(".top-categories").classList.add("hidden")
			this.dom.querySelector(".align").classList.remove("hidden")
			this.showPopTool()

		})

		this.dom.querySelector("#pt-link").addEventListener('click', (e) => {

			this.dom.querySelector(".top-categories").classList.add("hidden")
			this.dom.querySelector(".input").classList.remove("hidden")
			this.showPopTool()

			this.tempLinkRange = this.sel.getCurrentRange()

			setTimeout(() => {
				document.querySelector(".pack.input input").focus()
			}, 0)

		})

		this.dom.querySelector(".pack.input input").addEventListener("keydown", function(e) {
			if (e.which === 13) {
				e.preventDefault()
				self.hidePopTool()
				self.sel.setRange(self.tempLinkRange)
				// self.postEditor.selManager.link(this.value)
				setTimeout(() => {
					this.value = ""
				}, 200)

			}
		})

		this.dom.querySelector("#pt-blockquote").addEventListener('click', (e) => {

			this.transformNodes("blockquote")

		})

		this.dom.querySelectorAll(".pack button").forEach((elm) => {
			elm.addEventListener('click', () => {
				this.showPopTool()
			})
		})
	}

	togglePopTool() {
		if (document.getSelection().rangeCount === 0) {
			return
		}
		var range = this.sel.getCurrentRange()
		if (range && !range.isCollapsed()) {
			this.showPopTool()
		} else {
			this.hidePopTool()
		}
	}

	showPopTool() {

		var range = document.getSelection().getRangeAt(0)

		let currentRange = this.sel.getCurrentRange()
		var currentNode = this.nodeMan.getChildByID(currentRange.start.nodeID)

		if (!currentNode) {
			this.hidePopTool()
			return
		}

		if (
			currentNode.type === "LI"
		) {

			this.setPopToolMenu({
				heading: false,
				align: false,
				blockquote: false
			})

		} else if (
			currentNode.type === "BLOCKQUOTE"
		) {

			this.setPopToolMenu({
				heading: false,
				align: false
			})

		} else if (
			currentNode.type === "FIGURE"
		) {

			this.setPopToolMenu({
				heading: false,
				align: false,
				blockquote: false
			})

		} else {

			this.setPopToolMenu({})

		}

		var left = range.getBoundingClientRect().left - document.querySelector("#post-editor").getBoundingClientRect().left + range.getBoundingClientRect().width / 2 - this.dom.getBoundingClientRect().width / 2

		if (left < 10) {

			left = 10

		} else if (left + this.dom.getBoundingClientRect().width > document.body.clientWidth - 10) {

			left = document.body.clientWidth - 10 - this.dom.getBoundingClientRect().width

		}

		this.dom.style.left = left + "px"

		var top = range.getBoundingClientRect().top - document.querySelector("#post-editor").getBoundingClientRect().top - this.dom.getBoundingClientRect().height - 5

		if (top - window.pageYOffset < 10) {

			top = range.getBoundingClientRect().bottom - document.querySelector("#post-editor").getBoundingClientRect().top + 5

		}

		this.dom.style.top = top + "px"


		this.dom.classList.add("active")

	}

	hidePopTool() {
		this.dom.classList.remove("active")
		setTimeout(() => {
			this.dom.querySelector(".top-categories").classList.remove("hidden")
			this.dom.querySelector(".title-style").classList.add("hidden")
			this.dom.querySelector(".text-style").classList.add("hidden")
			this.dom.querySelector(".align").classList.add("hidden")
			this.dom.querySelector(".input").classList.add("hidden")
		}, 100)

	}

	setPopToolMenu(config) {

		// Link and text style is always available

		if ("heading" in config) {
			if (!config["heading"]) {
				this.dom.querySelector("#pt-title-pack").classList.add("hidden")
			} else {
				this.dom.querySelector("#pt-title-pack").classList.remove("hidden")
			}
		} else {
			this.dom.querySelector("#pt-title-pack").classList.remove("hidden")
		}

		if ("align" in config) {
			if (!config["align"]) {
				this.dom.querySelector("#pt-align-pack").classList.add("hidden")
			} else {
				this.dom.querySelector("#pt-align-pack").classList.remove("hidden")
			}
		} else {
			this.dom.querySelector("#pt-align-pack").classList.remove("hidden")
		}

		if ("blockquote" in config) {
			if (!config["blockquote"]) {
				this.dom.querySelector("#pt-blockquote").classList.add("hidden")
			} else {
				this.dom.querySelector("#pt-blockquote").classList.remove("hidden")
			}
		} else {
			this.dom.querySelector("#pt-blockquote").classList.remove("hidden")
		}

	}

	/**
	 * Changes the selection's text style.
	 * @param {string} method 
	 */
	changeTextStyle(method)
	{

		// console.log(document.execCommand('bold', false))
		// this.itmotnTT("strong")
		// this.styleText("strong")
		document.execCommand(method, false)

	}

	/**
	 * 
	 * @param {string} tagName 
	 */
	transformNodes(tagName)
	{
		tagName = tagName.toUpperCase()
		let chunks = this.sel.getAllNodesInRange()
		let range = this.sel.getCurrentRange()
		let isAllAlreaySet = true
		for (let i = 0; i < chunks.length; i++) {
			if (!AN.transformable.includes(chunks[i].type)) {
				continue
			}
			if (chunks[i].type !== tagName) {
				isAllAlreaySet = false
			}
			// chunks[i].transformTo(tagName)
			this.nodeMan.transformNode(chunks[i], tagName)
		}

		if (isAllAlreaySet) {
			for (let i = 0; i < chunks.length; i++) {
				// chunks[i].transformTo("P")
				this.nodeMan.transformNode(chunks[i], "P")
			}
		}

		this.sel.setRange(range)
	}

	/**
	 * 
	 * @param {string} dir "left" | "center" | "right"
	 */
	align(dir)
	{
		let chunks = this.sel.getAllNodesInRange()
		for (let i = 0; i < chunks.length; i++) {
			if (!AN.alignable.includes(chunks[i].type)) {
				continue
			}
			chunks[i].dom.style.textAlign = dir
		}
	}

	/**
	*
	* @param {HTMLElement} imageBlock
	*/
	showImageTool(imageBlock) {

		let editorBody = this.session.editorBody

		this.imageTool.classList.add("active")

		this.imageTool.style.left =
		imageBlock.getBoundingClientRect().left +
		imageBlock.getBoundingClientRect().width / 2 -
		this.imageTool.getBoundingClientRect().width / 2
		+ "px"

		this.imageTool.style.top =
		- editorBody.getBoundingClientRect().top +
		imageBlock.getBoundingClientRect().top +
		imageBlock.getBoundingClientRect().height / 2 -
		this.imageTool.getBoundingClientRect().height / 2
		+ "px"

		// this.imageTool.style.top = imageBlock.getBoundingClientRect().top - this.editor.getBoundingClientRect().top + "px"
	}

	hideImageTool() {
		this.imageTool.classList.remove("active")
	}

}