export default class PRange {

	constructor()
	{
		this.startContainer = null
		this.startOffset = null
		this.endContainer = null
		this.endOffset = null
	}

	/**
	 * 
	 * @param {Node} node 
	 * @param {Number} textOffset 
	 */
	setStart(node, textOffset)
	{

		let travelNode = node.firstChild
		let length = 0
		let loopDone = false

		this.startContainer = node
		this.startOffset = 0

		if (textOffset === -1) {
			textOffset = node.textContent.length
		}

		while (1) {

			if (travelNode.nodeType === 3) {

				if (length + travelNode.textContent.length >= textOffset) {

					this.startContainer = travelNode
					this.startOffset = textOffset - length
					break

				} else {

					length += travelNode.textContent.length

				}

			}

			if (travelNode.firstChild) {

				travelNode = travelNode.firstChild

			} else if (travelNode.nextSibling) {

				travelNode = travelNode.nextSibling

			} else {

				travelNode = travelNode.parentNode

				while (1) {

					if (travelNode.isEqualNode(node)) {
						loopDone = true
						break
					} else if (travelNode.nextSibling) {
						travelNode = travelNode.nextSibling
						break
					} else {
						travelNode = travelNode.parentNode
					}

				}
				
			}

			if (loopDone) {
				break
			}

		}

	}

	/**
	 * 
	 * @param {Node} node 
	 * @param {Number} textOffset 
	 */
	setEnd(node, textOffset)
	{
		let travelNode = node.firstChild
		let length = 0
		let loopDone = false

		this.endContainer = node
		this.endOffset = 0

		if (textOffset === -1) {
			textOffset = node.textContent.length
		}

		while (1) {

			if (travelNode.nodeType === 3) {

				if (length + travelNode.textContent.length >= textOffset) {

					this.endContainer = travelNode
					this.endOffset = textOffset - length
					break

				} else {

					length += travelNode.textContent.length

				}

			}

			if (travelNode.firstChild) {

				travelNode = travelNode.firstChild

			} else if (travelNode.nextSibling) {

				travelNode = travelNode.nextSibling

			} else {

				travelNode = travelNode.parentNode

				while (1) {

					if (travelNode.isEqualNode(node)) {
						loopDone = true
						break
					} else if (travelNode.nextSibling) {
						travelNode = travelNode.nextSibling
						break
					} else {
						travelNode = travelNode.parentNode
					}

				}

			}

			if (loopDone) {
				break
			}

		}
	}

	/**
	 * 
	 * @param {Node} node 
	 * @param {Node} container 
	 * @param {Number} rangeOffset 
	 */
	getTextOffset(node, container, rangeOffset)
	{

		let travelNode = node.firstChild
		let length = 0
		let loopDone = false

		while (1) {

			if (travelNode.nodeType === 3) {

				if (travelNode.isEqualNode(container)) {

					length += rangeOffset
					break

				} else {

					length += travelNode.textContent.length

				}

			}

			if (travelNode.firstChild) {

				travelNode = travelNode.firstChild

			} else if (travelNode.nextSibling) {

				travelNode = travelNode.nextSibling

			} else {

				travelNode = travelNode.parentNode

				while (1) {

					if (travelNode.isEqualNode(node)) {
						loopDone = true
						break
					} else if (travelNode.nextSibling) {
						travelNode = travelNode.nextSibling
						break
					} else {
						travelNode = travelNode.parentNode
					}

				}

			}

			if (loopDone) {
				break
			}

		}

		return length
	}

	setThisRange()
	{

	}

}