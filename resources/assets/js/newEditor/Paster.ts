import TypeChecker from "./TypeChecker";
import { AT } from "./AvailableTypes";
import NodeManager from "./NodeManager";
import EditSession from "./EditSession";

export default class Paster {
	pasteArea: Element

	constructor() {}

	convert(elm: HTMLElement) {
		this.pasteArea = elm

		// this.loopChildren(elm, 1)
		// this.loopChildren(elm, 2)
		// this.loopChildren(elm, 3)
		this.fixElement(elm, 1)
		this.fixElement(elm, 2)
		this.fixElement(elm, 3)
		this.fixElement(elm, 4)

		this.paste()
	}

	fixElement(fixingTarget: HTMLElement, phase: number) {
		if (phase === 1) {
			let allElems = fixingTarget.querySelectorAll("*")

			for (let i = 0; i < allElems.length; i++) {
				let elm = allElems[i]
				if (!elm.parentElement) continue

				let tagName = elm.tagName.toLowerCase()

				if (AT.availableTags.includes(tagName)) {
					console.log(elm)
					this.removeAllAttributes(elm)
				} else {
					if (elm.textContent === "") {
						elm.parentElement.removeChild(elm)
						continue
					}

					let displayStyle = this.getDisplayStyle(elm)

					if (displayStyle === "inline" || displayStyle === "inline-block") {
						let n, frag
						frag = document.createDocumentFragment()

						if ((<HTMLElement> elm).style.textDecoration) {
							if ((<HTMLElement> elm).style.textDecoration === "underline") {
								frag = document.createElement("u")
							} else if ((<HTMLElement> elm).style.textDecoration === "line-through") {
								frag = document.createElement("strike")
							}
						}

						while (n = elm.firstChild) {
							frag.appendChild(n)
						}
						elm.parentNode.replaceChild(frag, elm)
					}
				}
			}

			fixingTarget.normalize()
		} else if (phase === 2) {
			// 모든 div 태그를 제거
			let allElems = fixingTarget.querySelectorAll("*")

			for (let i = allElems.length - 1; i >= 0; i--) {
				let n, frag, elm = allElems[i]
				let tagName = elm.nodeName.toLowerCase()

				if (!AT.availableTags.includes(tagName)) {
					let childNodes = elm.childNodes
					let isWrappable = true
					
					frag = document.createElement("p")
					
					while (n = elm.firstChild) {
						frag.appendChild(n)
					}
					elm.parentNode.replaceChild(frag, elm)
				}
			}
		} else if (phase === 3) {
			let allElems = fixingTarget.querySelectorAll("p")

			allElems.forEach(elm => {
				let tagName = elm.nodeName.toLowerCase()
				let frag, n
				let childNodes = elm.childNodes
				let isWrappable = true
				for (let i = 0; i < childNodes.length; i++) {
					let displayStyle: string, child = childNodes[i]
					
					if (child instanceof Element) {
						displayStyle = this.getDisplayStyle(child)
				
						if (displayStyle !== "inline" && displayStyle !== "inline-block") {
							isWrappable = false
							break
						}
					}
				}
				
				if (!isWrappable) {
					frag = document.createDocumentFragment()

					while (n = elm.firstChild) {
						frag.appendChild(n)
					}
					
					elm.parentElement.replaceChild(frag, elm)
				}
			})
		} else if (phase === 4) {
			let childNodes = fixingTarget.childNodes

			for (let i = 0; i < childNodes.length; i++) {
				let child = childNodes[i]
				let nodeName = child.nodeName.toLowerCase()
				if (!AT.topTagsForPaster.includes(nodeName)) {
					let p = document.createElement("p")
					child.parentNode.insertBefore(p, child)
					p.appendChild(child)
				}
			}
		}
	}

	getDisplayStyle(elm: Element) {
		let displayStyle: string
		if (window.getComputedStyle) {
			displayStyle = window.getComputedStyle(elm, null).getPropertyValue("display")
		} else {
			displayStyle = (<any> elm).currentStyle.display
		}

		return displayStyle
	}

	removeAllAttributes(elm: Element) {
		let atts = []
		for (let i = 0; i < elm.attributes.length; i++) {
			atts.push(elm.attributes[i].name)
		}
		for (let i = 0; i < atts.length; i++) {
			if (elm.nodeName.toLowerCase() === "a" && atts[i] === "href") {
				continue
			}
			elm.removeAttribute(atts[i])
		}
	}

	paste() {
		let childNodes = this.pasteArea.childNodes
		let insertingTarget = EditSession.currentState.node
	}
}
