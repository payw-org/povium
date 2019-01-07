import PVMNode from "./PVMNode"
import SelectionManager from "./SelectionManager"
import PopTool from "./PopTool";
import EditSession from "./EditSession";

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
		let imageWrapper = this.element.querySelector(".image-wrapper")
		imageWrapper.addEventListener("click", e => {
			this.selectImage()
		})
	}

	selectImage() {
		console.log("select image")
		this.element.classList.remove("caption-focused")
		this.element.classList.add("node-selected")
		PopTool.showImageTool(this.element.querySelector(".image-wrapper"))
		if (!this.captionEnabled) {
			this.setInnerHTML("")
		}
	}

	focusCaption() {
		this.element.classList.remove("node-selected")
		this.element.classList.add("caption-focused")

		if (!this.captionEnabled) {
			// this.setInnerHTML("")
		}
	}

	setImageUrl(newUrl: string) {
		// Verify the new url
		//
		this.element.querySelector("img").src = newUrl
	}
}