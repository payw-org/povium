import PRange from "./PRange"
import PostEditor from "./PostEditor";

export default class UndoManager {

	/**
	 * 
	 * @param {PostEditor} postEditor 
	 */
	constructor(postEditor)
	{
		this.postEditor = postEditor
		this.actionStack = []
		this.currentStep = -1
	}

	recordAction(actionData)
	{

		if (
			this.actionStack[this.currentStep] &&
			("linked" in this.actionStack[this.currentStep]) &&
			this.actionStack[this.currentStep].linked === true &&
			("linked" in actionData) &&
			actionData.linked === true
		) {
			let actionArr = []
			actionArr.push(this.actionStack[this.currentStep])
			actionArr.push(actionData)
			this.actionStack[this.currentStep] = actionArr
		} else {
			this.actionStack.length = this.currentStep + 1
			this.actionStack.push(actionData)
			this.currentStep = this.actionStack.length - 1
		}



		console.group("Actions history stack recorded")
		console.log(this.actionStack)
		console.groupEnd()
	}

	undo()
	{

		if (this.currentStep < 0) {
			console.info('no more action records')
			return
		} else {
			console.group("undo")
		}

		// get action type

		let action = this.actionStack[this.currentStep]
		console.log(action)
		console.groupEnd()

		if (action.length) {

			for (let i = action.length - 1; i >= 0; i--) {

				this.undoWithAction(action[i])

			}

		} else {

			this.undoWithAction(action)

		}

		this.currentStep--

	}

	redo()
	{

		if (this.currentStep >= this.actionStack.length - 1) {
			console.info('no more actions to recover')
			return
		} else {
			console.group('redo')
		}

		this.currentStep++
		var action = this.actionStack[this.currentStep]
		console.log(action)
		console.groupEnd()

		if (action.length) {

			for (let i = 0; i < action.length; i++) {

				this.redoWithAction(action[i])

			}

		} else {

			this.redoWithAction(action)

		}

	}

	undoWithAction(action)
	{
		if (action.type === "align") {

			for (let i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.style.textAlign = action.nodes[i].previousState

				let range = document.createRange()
				let pRange = new PRange()

				pRange.setStart(action.pRange.startNode, action.pRange.startTextOffset)
				pRange.setEnd(action.pRange.endNode, action.pRange.endTextOffset)

				range.setStart(pRange.startContainer, pRange.startOffset)
				range.setEnd(pRange.endContainer, pRange.endOffset)

				window.getSelection().removeAllRanges()
				window.getSelection().addRange(range)

			}

		} else if (action.type === "add") {

			if (action.previousSibling) {
				action.newNode.parentNode.removeChild(action.newNode)
				this.postEditor.selManager.setCursorAt(action.previousSibling, -1)
			} else if (action.nextSibling) {
				action.newNode.parentNode.removeChild(action.newNode)
			}

		} else if (action.type === "remove") {

			for (let i = action.targets.length - 1; i >= 0; i--) {

				if (action.targets[i].nextNode && action.targets[i].nextNode.parentNode) {

					action.targets[i].nextNode.parentNode.insertBefore(action.targets[i].removedNode, action.targets[i].nextNode)

				} else if (action.targets[i].previousNode && action.targets[i].previousNode.parentNode) {

					action.targets[i].previousNode.parentNode.insertBefore(action.targets[i].removedNode, action.targets[i].previousNode.nextSibling)

				} else if (action.targets[i].parentNode) {

					action.targets[i].parentNode.appendChild(action.targets[i].removedNode)

				} else if (action.targets[i].originalContent) {

					action.targets[i].removedNode.innerHTML = action.targets[i].originalContent

				}

			}

			let pRange = new PRange()
			pRange.setStart(action.range.previousState.startNode, action.range.previousState.startTextOffset)
			pRange.setEnd(action.range.previousState.endNode, action.range.previousState.endTextOffset)
			let range = document.createRange()
			if (pRange.startContainer) {
				range.setStart(pRange.startContainer, pRange.startOffset)
			}
			if (pRange.endContainer) {
				range.setEnd(pRange.endContainer, pRange.endOffset)
			}
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range)

		} else if (action.type === "split") {

			action.nextState.newNode.parentNode.removeChild(action.nextState.newNode)

			action.target.innerHTML = action.previousState.content

			this.postEditor.selManager.setCursorAt(action.target, action.nextState.length)

		} else if (action.type === "change") {

			let node

			for (let i = 0; i < action.targets.length; i++) {

				window.getSelection().removeAllRanges()

				while (node = action.targets[i].nextTarget.firstChild) {
					action.targets[i].previousTarget.appendChild(node)
				}

				action.targets[i].nextTarget.parentNode.replaceChild(action.targets[i].previousTarget, action.targets[i].nextTarget)

			}

			let pRange = new PRange()
			pRange.setStart(action.range.previousState.startNode, action.range.previousState.startTextOffset)
			pRange.setEnd(action.range.previousState.endNode, action.range.previousState.endTextOffset)
			let range = document.createRange()
			if (pRange.startContainer) {
				range.setStart(pRange.startContainer, pRange.startOffset)
			}
			if (pRange.endContainer) {
				range.setEnd(pRange.endContainer, pRange.endOffset)
			}
			window.getSelection().addRange(range)

		} else if (action.type === "merge") {

			action.mergedNode.innerHTML = action.mergedNodeOriginalContent
			if (action.removedNodePreviousNode && action.removedNodePreviousNode.parentNode) {

				action.removedNodePreviousNode.parentNode.insertBefore(action.removedNode, action.removedNodePreviousNode.nextSibling)

			} else if (action.removedNodeNextNode && action.removedNodeNextNode.parentNode) {

				action.removedNodeNextNode.parentNode.insertBefore(action.removedNode, action.removedNodeNextNode)

			}

			action.removedContentTarget.innerHTML = action.removedContent

			let pRange = new PRange()
			pRange.setStart(action.range.previousState.startNode, action.range.previousState.startTextOffset)
			pRange.setEnd(action.range.previousState.endNode, action.range.previousState.endTextOffset)
			let range = document.createRange()
			if (pRange.startContainer) {
				range.setStart(pRange.startContainer, pRange.startOffset)
			}
			if (pRange.endContainer) {
				range.setEnd(pRange.endContainer, pRange.endOffset)
			}
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range)

		} else if (action.type === "textChange") {

			// action.targetNode.innerHTML = action.targetNode.innerHTML.slice(0, action.nextDiffStart) + action.prevDiffContent + action.targetNode.innerHTML.slice(action.nextDiffEnd + 1, action.targetNode.innerHTML.length)

			action.targetNode.innerHTML = action.prevContent

			this.postEditor.selManager.setCursorAt(action.targetNode, action.prevTextOffset)

		} else if (action.type === "textStyleChange") {

			let pRange = new PRange()
			pRange.setStart(action.startNode, action.startTextOffset)
			pRange.setEnd(action.endNode, action.endTextOffset)
			let range = document.createRange()
			if (pRange.startContainer) {
				range.setStart(pRange.startContainer, pRange.startOffset)
			}
			if (pRange.endContainer) {
				range.setEnd(pRange.endContainer, pRange.endOffset)
			}
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range)

			document.execCommand(action.method, false)

		}
	}

	redoWithAction(action)
	{
		if (action.type === "align") {

			for (var i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.style.textAlign = action.nodes[i].nextState

				let range = document.createRange()
				let pRange = new PRange()

				pRange.setStart(action.pRange.startNode, action.pRange.startTextOffset)
				pRange.setEnd(action.pRange.endNode, action.pRange.endTextOffset)

				range.setStart(pRange.startContainer, pRange.startOffset)
				range.setEnd(pRange.endContainer, pRange.endOffset)

				window.getSelection().removeAllRanges()
				window.getSelection().addRange(range)

			}

		} else if (action.type === "add") {

			if (action.previousSibling) {
				action.previousSibling.parentNode.insertBefore(action.newNode, action.previousSibling.nextSibling)
				this.postEditor.selManager.setCursorAt(action.newNode, 0)
			} else if (action.nextSibling) {
				action.nextSibling.parentNode.insertBefore(action.newNode, action.nextSibling)
			}

		} else if (action.type === "remove") {

			for (let i = 0; i < action.targets.length; i++) {

				// while (node = action.targets[i].previousTarget.firstChild) {
				// 	action.targets[i].nextTarget.appendChild(node)
				// }

				// action.targets[i].previousTarget.parentNode.replaceChild(action.targets[i].nextTarget, action.targets[i].previousTarget)

				if (action.targets[i].previousNode && action.targets[i].previousNode.parentNode) {

					action.targets[i].previousNode.parentNode.removeChild(action.targets[i].removedNode)

				} else if (action.targets[i].nextNode && action.targets[i].nextNode.parentNode) {

					action.targets[i].nextNode.parentNode.removeChild(action.targets[i].removedNode)

				} else if (action.targets[i].parentNode) {

					action.targets[i].parentNode.removeChild(action.targets[i].removedNode)

				} else if (action.targets[i].modifiedContent) {

					console.log(action.targets[i].modifiedContent)
					action.targets[i].removedNode.innerHTML = action.targets[i].modifiedContent

				}

			}

			let pRange = new PRange()
			pRange.setStart(action.range.nextState.startNode, action.range.nextState.startTextOffset)
			pRange.setEnd(action.range.nextState.endNode, action.range.nextState.endTextOffset)
			let range = document.createRange()
			if (pRange.startContainer) {
				range.setStart(pRange.startContainer, pRange.startOffset)
			}
			if (pRange.endContainer) {
				range.setEnd(pRange.endContainer, pRange.endOffset)
			}
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range)

		} else if (action.type === "split") {

			action.target.parentNode.insertBefore(action.nextState.newNode, action.target.nextSibling)

			action.target.innerHTML = action.nextState.content

			this.postEditor.selManager.setCursorAt(action.nextState.newNode, 0)

		} else if (action.type === "change") {

			let node

			for (let i = 0; i < action.targets.length; i++) {

				window.getSelection().removeAllRanges()

				while (node = action.targets[i].previousTarget.firstChild) {
					action.targets[i].nextTarget.appendChild(node)
				}

				action.targets[i].previousTarget.parentNode.replaceChild(action.targets[i].nextTarget, action.targets[i].previousTarget)

			}

			let pRange = new PRange()
			pRange.setStart(action.range.nextState.startNode, action.range.nextState.startTextOffset)
			pRange.setEnd(action.range.nextState.endNode, action.range.nextState.endTextOffset)
			let range = document.createRange()
			if (pRange.startContainer) {
				range.setStart(pRange.startContainer, pRange.startOffset)
			}
			if (pRange.endContainer) {
				range.setEnd(pRange.endContainer, pRange.endOffset)
			}
			window.getSelection().addRange(range)

		} else if (action.type === "merge") {

			action.removedNode.parentNode.removeChild(action.removedNode)
			action.mergedNode.innerHTML = action.mergedContent

			let pRange = new PRange()
			pRange.setStart(action.range.nextState.startNode, action.range.nextState.startTextOffset)
			pRange.setEnd(action.range.nextState.endNode, action.range.nextState.endTextOffset)
			let range = document.createRange()
			if (pRange.startContainer) {
				range.setStart(pRange.startContainer, pRange.startOffset)
			}
			if (pRange.endContainer) {
				range.setEnd(pRange.endContainer, pRange.endOffset)
			}
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range)

		} else if (action.type === "textChange") {

			// action.node.innerHTML = action.node.innerHTML.slice(0, action.prevDiffStart) + action.nextDiffContent + action.node.innerHTML.slice(action.prevDiffEnd + 1, action.node.innerHTML.length)

			action.targetNode.innerHTML = action.nextContent

			this.postEditor.selManager.setCursorAt(action.targetNode, action.nextTextOffset)

		} else if (action.type === "textStyleChange") {

			let pRange = new PRange()
			pRange.setStart(action.startNode, action.startTextOffset)
			pRange.setEnd(action.endNode, action.endTextOffset)
			let range = document.createRange()
			if (pRange.startContainer) {
				range.setStart(pRange.startContainer, pRange.startOffset)
			}
			if (pRange.endContainer) {
				range.setEnd(pRange.endContainer, pRange.endOffset)
			}
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range)

			document.execCommand(action.method, false)

		}
	}

	getTheLatestAction()
	{

		return this.actionStack[this.currentStep]

	}

}
