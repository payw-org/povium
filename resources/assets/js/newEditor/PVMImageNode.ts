import PVMNode from "./PVMNode"
import SelectionManager from "./SelectionManager"
import PopTool from "./PopTool";
import EditSession from "./EditSession";
import EventManager from "./EventManager";

export default class PVMImageNode extends PVMNode {
	captionEnabled: boolean = false

	constructor() {
		super()
	}

	selectNode() {
		this.element.classList.remove("caption-focused")
		this.element.classList.add("node-selected")
	}

	attachEventListeners() {
		this.textElement.addEventListener("keydown", e => {
			setTimeout(() => {
				this.setCaption()
			}, 0)
		})
	}

	select() {
		// When selecting an image independently,
		// all other ranges in the window must be removed
		// to be recognized the PVMRange correctly
		// from SelectionManager
		window.getSelection().removeAllRanges()

		// Add classes to dom
		this.element.classList.remove("caption-focused")
		this.element.classList.add("node-selected")

		// Set imageTool
		PopTool.showImageTool(this.element.querySelector(".image-wrapper"))

		// If the caption is empty, set default value
		if (!this.captionEnabled) {
			this.setInnerHTML("이미지 설명")
		}
	}

	focusCaption() {
		this.element.classList.remove("node-selected")
		this.element.classList.add("caption-focused")
		PopTool.hideImageTool()

		if (!this.captionEnabled) {
			this.setInnerHTML("")
		}
	}

	setCaption() {
		console.log("setting caption")
		let tc = this.textElement.textContent
		if (tc.length > 0) {
			this.captionEnabled = true
			this.element.classList.add("caption-enabled")
		} else {
			this.captionEnabled = false
			this.element.classList.remove("caption-enabled")
			this.focusCaption()
		}
	}

	setImageUrl(newUrl: string) {
		// Verify the new url
		//
		this.element.querySelector("img").src = newUrl
	}
}