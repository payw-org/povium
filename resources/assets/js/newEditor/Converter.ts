import * as PostData from "./interfaces/PostData"
import NodeManager from "./NodeManager"
import PVMNode from "./PVMNode";
import { AT } from "./config/AvailableTypes";
import TypeChecker from "./TypeChecker";

export default class Converter {
	static parse(frame: PostData.Frame): PVMNode[] {

		let contents = frame.contents

		let firstChild

		let pvmNodes = []

		for (let i = 0; i < contents.length; i++) {
			let block = contents[i]

			let parentType = null
			if ((<PostData.TextBlock>block).parentType) {
				parentType = (<PostData.TextBlock>block).parentType
			}

			let node

			if (PostData.isTextOnlyBlock(block)) {
				let html = ""

				for (let j = 0; j < block.data.length; j++) {
					let text = block.data[j].data
					let htmlPart = text
					let style = block.data[j].style

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

				node = NodeManager.createNode(block.type, {
					parentType: parentType,
					html: html
				})

			} else if (PostData.isImageBlock(block)) {
				let html = ""

				if (block.caption) {
					for (let j = 0; j < block.caption.data.length; j++) {
						let text = block.caption.data[j].data
						let htmlPart = text
						let style = block.caption.data[j].style

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
				}

				node = NodeManager.createNode(block.type, {
					url: block.url,
					html: html,
					size: block.size
				})
			}

			pvmNodes.push(node)

		}

		return pvmNodes

	}

	static stringify(editorNodes: PVMNode[]) {
		let dataObj: PostData.Frame = {
			title: "",
			subtitle: "",
			body: "",
			contents: [],
			isPremium: null
		}

		let title: string = null,
		subtitle: string = null,
		body = ""

		editorNodes.forEach(pvmNode => {

			let block: PostData.Block = {
				type: pvmNode.type

			}
		})

		return JSON.stringify(dataObj)
	}
}
