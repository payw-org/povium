import * as PostData from "./interfaces/PostData"
import NodeManager from "./NodeManager"
import PVMNode from "./PVMNode"
import { AT } from "./AvailableTypes"
import TypeChecker from "./TypeChecker"
import PVMImageNode from "./PVMImageNode"

export default class Converter {
	static parse(frame: PostData.Frame): PVMNode[] {

		let contents = frame.contents

		let firstChild

		let pvmNodes = []

		for (let i = 0; i < contents.length; i++) {
			let block = contents[i]

			let node

			if (PostData.isTextOnlyBlock(block)) {
				let html = "", kind = undefined

				if (block.hasOwnProperty("kind")) {
					kind = block.kind
				}

				html = this.extractHtmlFromTextData(block.data)

				node = NodeManager.createNode(block.type, {
					kind: kind,
					html: html
				})

			} else if (PostData.isImageBlock(block)) {
				let html = ""

				if (block.captionEnabled) {
					html = this.extractHtmlFromTextData(block.caption.data)
				}

				node = NodeManager.createNode(block.type, {
					url: block.url,
					html: html,
					kind: block.kind
				})
			}

			pvmNodes.push(node)

		}

		return pvmNodes
	}

	static extractHtmlFromTextData(data: Array<PostData.StyledText | PostData.RawText>) {
		let html = ""

		data.forEach(datum => {
			if (datum.type === "styledText") {
				datum = datum as PostData.StyledText
				html += this.extractHtmlFromStyledText(datum)
			} else if (datum.type === "rawText") {
				datum = datum as PostData.RawText
				html += datum.data
			}
		})

		return html
	}

	static extractHtmlFromStyledText(st: PostData.StyledText) {
		let producedHtml = ""
		let tag = this.style2Tag(st.style)
		producedHtml += "<" + tag + ">"

		st.data.forEach(datum => {
			if (datum.type === "styledText") {
				datum = datum as PostData.StyledText
				producedHtml += this.extractHtmlFromStyledText(datum)
			} else if (datum.type === "rawText") {
				datum = datum as PostData.RawText
				producedHtml += this.escapeHtml(datum.data)
			}
		})

		producedHtml += "</" + tag + ">"

		return producedHtml
	}

	static tag2Style(tag: string): string {
		tag = tag.toLocaleLowerCase()
		let style: string

		if (tag === "b" || tag === "strong") {
			style = "bold"
		} else if (tag === "em" || tag === "i") {
			style = "italic"
		} else if (tag === "u") {
			style = "underline"
		} else if (tag === "strike") {
			style = "strike"
		} else if (tag === "a") {
			style = "link"
		}

		return style
	}

	static style2Tag(style: string): string {
		style = style.toLocaleLowerCase()
		let tag: string

		if (style === "bold") {
			tag = "strong"
		} else if (style === "italic") {
			tag = "em"
		} else if (style === "underline") {
			tag = "u"
		} else if (style === "strike") {
			tag = "strike"
		} else if (style === "link") {
			tag = "a"
		}

		return tag
	}

	static verifyStyleTag(tag: string): boolean {
		tag = tag.toLocaleLowerCase()
		if (
			tag === "b" ||
			tag === "strong" ||
			tag === "i" ||
			tag === "em" ||
			tag === "u" ||
			tag === "strike" ||
			tag === "a"
		) {
			return true
		} else {
			return false
		}
	}

	static escapeHtml(html: string) {
		interface map {
			[key: string]: string
		}
		let entityMap: map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
			'/': '&#x2F;',
			'`': '&#x60;',
			'=': '&#x3D;'
		}

		return String(html).replace(/[&<>"'`=\/]/g, s => {
			return entityMap[s];
		})
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
			NodeManager.normalize(pvmNode.textElement)
			
			if (TypeChecker.isTextOnly(pvmNode.type)) {
				let block: PostData.TextBlock = {
					type: pvmNode.type,
					data: this.buildTextDataFromHtml(pvmNode.element)
				}
				// Align
				//

				// Kind
				if (pvmNode.kind) {
					block.kind = pvmNode.kind
				}
				dataObj.contents.push(block)
			} else if (TypeChecker.isImage(pvmNode.type)) {
				let n = pvmNode as PVMImageNode
				let block: PostData.ImageBlock = {
					type: "image",
					kind: n.kind,
					url: n.url,
					captionEnabled: n.captionEnabled
				}
				if (block.captionEnabled) {
					block.caption = {
						data: this.buildTextDataFromHtml(n.textElement)
					}
					// Align
					//

					// kind
					if (n.kind) {
						block.kind = n.kind
					}
				}
				dataObj.contents.push(block)
			}
		})

		console.log(dataObj)

		return JSON.stringify(dataObj)
	}

	static buildTextDataFromHtml(elm: HTMLElement): Array<PostData.StyledText | PostData.RawText> {
		let travelNode: Node = elm.firstChild
		let textData: Array<PostData.StyledText | PostData.RawText> = []

		while (travelNode) {
			if (travelNode.nodeType === 3 && travelNode.textContent.length > 0) {
				let rawTextData: PostData.RawText = {
					type: "rawText",
					data: travelNode.textContent
				}
				
				textData.push(rawTextData)
			} else {
				textData.push(this.buildStyledTextData(<HTMLElement> travelNode))
			}

			travelNode = travelNode.nextSibling
		}

		return textData
	}

	static buildStyledTextData(styledElm: HTMLElement): PostData.StyledText | PostData.RawText {
		if (!this.verifyStyleTag(styledElm.nodeName)) {
			let rawTextData: PostData.RawText = {
				type: "rawText",
				data: styledElm.textContent
			}
			return rawTextData
		}

		let style = this.tag2Style(styledElm.nodeName)

		let superStyledTextData: PostData.StyledText = {
			type: "styledText",
			style: style,
			data: []
		}

		if ((<HTMLAnchorElement> styledElm).href) {
			superStyledTextData.url = (<HTMLAnchorElement> styledElm).href
		}

		let travelNode: Node = styledElm.firstChild

		while (travelNode) {
			if (travelNode.nodeType === 3) {
				let rawTextData: PostData.RawText = {
					type: "rawText",
					data: travelNode.textContent
				}

				superStyledTextData.data.push(rawTextData)
			} else {
				superStyledTextData.data.push(this.buildStyledTextData(<HTMLElement> travelNode))
			}
			
			travelNode = travelNode.nextSibling
		}

		return superStyledTextData
	}
}
