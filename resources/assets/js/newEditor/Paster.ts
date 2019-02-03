import TypeChecker from "./TypeChecker";
import { AT } from "./AvailableTypes";

export default class Paster {
	complementP: HTMLElement

	constructor() {}

	convert(elm: HTMLElement) {
		// this.loopChildren(elm, 1)
		// this.loopChildren(elm, 2)
		// this.loopChildren(elm, 3)
		this.fixElement(elm, 1)
		this.fixElement(elm, 2)
	}

	// fixElement(elm: HTMLElement, phase: number) {
	// 	if (phase === 1) {
	// 		let spanWalker = document.createTreeWalker(elm, NodeFilter.SHOW_ELEMENT, null)

	// 		let span
	// 		let previousNode: Node
	// 		while (spanWalker.nextNode()) {
	// 			if (previousNode && previousNode.nodeName.toLowerCase() === "span") {
	// 				let frag = document.createDocumentFragment()
	// 				let n: Node
	// 				while (n = previousNode.firstChild) {
	// 					frag.appendChild(n)
	// 				}
	// 				previousNode.parentNode.replaceChild(frag, previousNode)
	// 			}
	// 			previousNode = spanWalker.currentNode
	// 		}
			
	// 		// Final attack
	// 		if (previousNode && previousNode.nodeName.toLowerCase() === "span") {
	// 			let frag = document.createDocumentFragment()
	// 			let n: Node
	// 			while (n = previousNode.firstChild) {
	// 				frag.appendChild(n)
	// 			}
	// 			previousNode.parentNode.replaceChild(frag, previousNode)
	// 		}

	// 		// Merge separated text nodes into a single text node
	// 		elm.normalize()
	// 	} else if (phase === 2) {
	// 		let elms = document.createTreeWalker(elm, NodeFilter.SHOW_ELEMENT, null)
	// 		let n: HTMLElement
	// 		let previousNode: Node
	// 		while (n = <HTMLElement> elms.nextNode()) {
	// 			if (previousNode) {
	// 				if (AT.availableTags.includes(previousNode.nodeName.toLowerCase())) {
	// 					let pn = <HTMLElement> previousNode
	// 					for (let i = 0; i < pn.attributes.length; i++) {
	// 						pn.removeAttribute(pn.attributes[i].name)
	// 					}
	// 				} else if (previousNode.nodeName.toLowerCase() === "div") {
	// 					let frag = document.createDocumentFragment()
	// 					let fc
	// 					while (fc = previousNode.firstChild) {
	// 						frag.appendChild(fc)
	// 					}

	// 					let br = document.createElement("br")
	// 					previousNode.parentNode.insertBefore(br, previousNode.nextSibling)

	// 					previousNode.parentNode.replaceChild(frag, previousNode)
	// 				} else {
	// 					previousNode.parentNode.removeChild(previousNode)
	// 				}
	// 			}
				
	// 			previousNode = n
	// 		}

	// 		// Final attack
	// 		if (previousNode) {
	// 			if (AT.availableTags.includes(previousNode.nodeName.toLowerCase())) {
	// 				let pn = <HTMLElement> previousNode
	// 				for (let i = 0; i < pn.attributes.length; i++) {
	// 					pn.removeAttribute(pn.attributes[i].name)
	// 				}
	// 			} else if (previousNode.nodeName.toLowerCase() === "div") {
	// 				let frag = document.createDocumentFragment()
	// 				let fc
	// 				while (fc = previousNode.firstChild) {
	// 					frag.appendChild(fc)
	// 				}

	// 				let br = document.createElement("br")
	// 				previousNode.parentNode.insertBefore(br, previousNode.nextSibling)

	// 				previousNode.parentNode.replaceChild(frag, previousNode)
	// 			} else {
	// 				previousNode.parentNode.removeChild(previousNode)
	// 			}
	// 		}
	// 	} else if (phase === 3) {
	// 		let travelNode = elm.firstChild
	// 		while (travelNode) {
	// 			let nextSibling: Node = travelNode.nextSibling

	// 			console.log(travelNode.cloneNode())
		
	// 			if (travelNode.nodeName.toLowerCase() === "br") {
	// 				// br tag
	// 				if (this.complementP) {
	// 					elm.insertBefore(this.complementP, travelNode)
	// 					elm.removeChild(travelNode)
	// 					this.complementP = undefined
	// 				} else {
	// 					elm.removeChild(travelNode)
	// 				}
	// 			} else if (AT.topTagsForPaster.includes(travelNode.nodeName.toLowerCase())) {
	// 				// available tag
	// 				if (this.complementP) {
	// 					elm.insertBefore(this.complementP, travelNode)
	// 					this.complementP = undefined
	// 				}
	// 			} else {
	// 				// unavailable tag
	// 				if (this.complementP) {
	// 					this.complementP.appendChild(travelNode)
	// 				} else {
	// 					this.complementP = document.createElement("p")
	// 					this.complementP.appendChild(travelNode)
	// 				}
	// 			}
		
	// 			;(<Node> travelNode) = nextSibling
	// 		}

	// 		// Final attack
	// 		if (this.complementP && this.complementP.firstChild) {
	// 			elm.appendChild(this.complementP)
	// 		}
	// 	}
	// }

	fixElement(elm: HTMLElement, phase: number) {
		let allElems = elm.querySelectorAll("*")
	}
	loopChildren(elm: HTMLElement, phase: number) {
		let travelNode = elm.firstChild
		
		while (travelNode) {
			if (phase === 3) {
				let nextSibling: Node = travelNode.nextSibling

				if (travelNode.nodeName.toLowerCase() === "br") {
					// br tag
					if (this.complementP) {
						elm.insertBefore(this.complementP, travelNode)
						elm.removeChild(travelNode)
					} else {
						elm.removeChild(travelNode)
					}
				} else if (AT.topTagsForPaster.includes(travelNode.nodeName.toLowerCase())) {
					// available tag
					if (this.complementP) {
						elm.insertBefore(this.complementP, travelNode)
					}
				} else {
					// unavailable tag
					if (this.complementP) {
						this.complementP.appendChild(travelNode)
					} else {
						this.complementP = document.createElement("p")
						this.complementP.appendChild(travelNode)
					}
				}

				;(<Node> travelNode) = nextSibling
				continue
			}

			if (travelNode.nodeName.toLowerCase() === "br") {
				;(<Node> travelNode) = travelNode.nextSibling
			} else if (travelNode.nodeType === 3) {
				// TextNode
				(<Node> travelNode) = travelNode.nextSibling
				console.log("text Node", travelNode)
			} else if (TypeChecker.isAvailbaleTag(travelNode.nodeName)) {
				console.log("Availble tag", travelNode)
				// Available tag
				// Remove all attributes
				let t = <HTMLElement> travelNode
				console.log(t.attributes)
				for (let i = 0; i < t.attributes.length; i++) {
					t.removeAttribute(t.attributes[i].name)
				}
				t.removeAttribute("style")

				this.loopChildren(<HTMLElement> travelNode, phase)

				;(<Node> travelNode) = travelNode.nextSibling
			} else {
				console.log("unsupported tag", travelNode)
				let frag, n: Node, isStyledSpanTag = false

				frag = document.createDocumentFragment()

				if (phase === 1) {
					if (travelNode.nodeName.toLowerCase() === "div") {
						this.loopChildren(<HTMLElement> travelNode, phase)
						let br = document.createElement("br")
						elm.insertBefore(br, travelNode.nextSibling)
						;(<Node> travelNode) = travelNode.nextSibling
						continue
					}
				}

				if (travelNode.nodeName.toLowerCase() === "span") {
					if ((<HTMLElement> travelNode).style.textDecoration === "underline") {
						frag = document.createElement("u")
						isStyledSpanTag = true
					} else if ((<HTMLElement> travelNode).style.textDecoration === "line-through") {
						frag = document.createElement("strike")
						isStyledSpanTag = true
					}
				}
				
				while (n = travelNode.firstChild) {
					// Move all children to the document fragment from the unsupported node
					frag.appendChild(n)
				}

				let originalTravelNode = travelNode
				
				if (isStyledSpanTag) {
					// Keep traveling from new element's next sibling
					(<Node> travelNode) = frag.nextSibling
				} else {
					// Keep traveling from new first child
					travelNode = frag.firstChild
				}
				
				// Replace the unsupported node with the document fragment
				elm.replaceChild(frag, originalTravelNode)
			}
		}

		if (phase === 1) {
			elm.normalize()
		}
	}
}
