import SelectionManager from "./SelectionManager";
import PRange from "./PRange";

export default class UndoManager {

	constructor()
	{
		this.selManager = new SelectionManager(null, this);
		this.actionStack = [];
		this.currentStep = -1;
	}

	recordAction(actionData)
	{

		this.actionStack.length = this.currentStep + 1;
		this.actionStack.push(actionData);
		this.currentStep = this.actionStack.length - 1;

		console.group("Actions history stack recorded");
		console.log(this.actionStack);
		console.groupEnd();
	}

	undo()
	{

		if (this.currentStep < 0) {
			console.log('no more action records');
			return;
		} else {
			console.group("undo");
		}
		
		// get action type

		let action = this.actionStack[this.currentStep];
		console.log(action);
		console.groupEnd();
		this.currentStep--;

		

		if (action.type === "align") {

			for (let i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.style.textAlign = action.nodes[i].previousState;

				let range = document.createRange();
				let pRange = new PRange();

				pRange.setStart(action.pRange.startNode, action.pRange.startTextOffset);
				pRange.setEnd(action.pRange.endNode, action.pRange.endTextOffset);

				range.setStart(pRange.startContainer, pRange.startOffset);
				range.setEnd(pRange.endContainer, pRange.endOffset);

				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);

			}

		} else if (action.type === "add") {

			if (action.previousSibling) {
				action.newNode.parentNode.removeChild(action.newNode);
				this.selManager.setCursorAt(action.previousSibling, -1);
			} else if (action.nextSibling) {
				action.newNode.parentNode.removeChild(action.newNode);
			}

		} else if (action.type === "split") {


			action.nextState.newNode.parentNode.removeChild(action.nextState.newNode);

			action.target.innerHTML = action.previousState.content;

			this.selManager.setCursorAt(action.target, action.nextState.length);

		} else if (action.type === "change") {

			let node;

			for (let i = 0; i < action.targets.length; i++) {

				window.getSelection().removeAllRanges();

				while (node = action.targets[i].nextTarget.firstChild) {
					action.targets[i].previousTarget.appendChild(node);
				}
				
				action.targets[i].nextTarget.parentNode.replaceChild(action.targets[i].previousTarget, action.targets[i].nextTarget);

			}

			let pRange = new PRange();
			pRange.setStart(action.targets[0].previousTarget, action.range.startTextOffset);
			pRange.setEnd(action.targets[action.targets.length - 1].previousTarget, action.range.endTextOffset);
			let range = document.createRange();
			range.setStart(pRange.startContainer, pRange.startOffset);
			range.setEnd(pRange.endContainer, pRange.endOffset);

			window.getSelection().addRange(range);

		}
		

	}

	redo()
	{
		
		if (this.currentStep >= this.actionStack.length - 1) {
			console.info('no more actions to recover');
			return;
		} else {
			console.group('redo');
		}

		this.currentStep++;
		var action = this.actionStack[this.currentStep];
		console.log(action);
		console.groupEnd();
		
		if (action.type === "align") {

			for (var i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.style.textAlign = action.nodes[i].nextState;
				
				let range = document.createRange();
				let pRange = new PRange();

				pRange.setStart(action.pRange.startNode, action.pRange.startTextOffset);
				pRange.setEnd(action.pRange.endNode, action.pRange.endTextOffset);

				range.setStart(pRange.startContainer, pRange.startOffset);
				range.setEnd(pRange.endContainer, pRange.endOffset);

				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);

			}

		} else if (action.type === "add") {

			if (action.previousSibling) {
				action.previousSibling.parentNode.insertBefore(action.newNode, action.previousSibling.nextSibling);
				this.selManager.setCursorAt(action.newNode, 0);
			} else if (action.nextSibling) {
				action.nextSibling.parentNode.insertBefore(action.newNode, action.nextSibling);
			}

		} else if (action.type === "split") {

			action.target.parentNode.insertBefore(action.nextState.newNode, action.target.nextSibling);

			action.target.innerHTML = action.nextState.content;

			this.selManager.setCursorAt(action.nextState.newNode, 0);

		} else if (action.type === "change") {

			let node;

			for (let i = 0; i < action.targets.length; i++) {

				window.getSelection().removeAllRanges();

				while (node = action.targets[i].previousTarget.firstChild) {
					action.targets[i].nextTarget.appendChild(node);
				}

				action.targets[i].previousTarget.parentNode.replaceChild(action.targets[i].nextTarget, action.targets[i].previousTarget);

			}

			let pRange = new PRange();
			pRange.setStart(action.targets[0].nextTarget, action.range.startTextOffset);
			pRange.setEnd(action.targets[action.targets.length - 1].nextTarget, action.range.endTextOffset);
			let range = document.createRange();
			range.setStart(pRange.startContainer, pRange.startOffset);
			range.setEnd(pRange.endContainer, pRange.endOffset);

			window.getSelection().addRange(range);

		}


	}

	getLatestAction()
	{
		return this.actionStack[this.currentStep];
	}

}