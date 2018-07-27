import SelectionManager from "./SelectionManager";

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

		console.log(this.actionStack);
	}

	undo()
	{

		if (this.currentStep < 0) {
			console.log('no more action records');
			return;
		} else {
			console.log('undo');
		}
		
		// get action type

		var action = this.actionStack[this.currentStep];
		this.currentStep--;

		if (action.type === "align") {

			for (var i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.style.textAlign = action.nodes[i].previousState;
				this.selManager.replaceRange(action.range);

			}

		} else if (action.type === "add") {

			for (var i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.parentNode.removeChild(action.nodes[i].target);
				this.selManager.replaceRange(action.range);

			}

		} else if (action.type === "split") {

			action.target.innerHTML = "";

			let reverts = this.selManager.cloneNodeAndRange(action.previousState.content, action.previousState.range);

			let revertedNode = reverts[0];
			let revertedRange = reverts[1];

			console.log(revertedRange);

			let node = revertedNode.firstChild;

			while (1) {
				if (node === null) {
					break;
				}
				action.target.appendChild(node);
				node = node.nextSibling;
			}

			this.selManager.replaceRange(revertedRange);

		}
		

	}

	redo()
	{
		
		if (this.currentStep >= this.actionStack.length - 1) {
			console.log('no more actions to recover');
			return;
		} else {
			console.log('redo');
		}

		this.currentStep++;
		var action = this.actionStack[this.currentStep];
		
		if (action.type === "align") {

			for (var i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.style.textAlign = action.nodes[i].nextState;
				this.selManager.replaceRange(action.range);

			}

		} else if (action.type === "split") {

			var range = document.createRange();
			range.setStart(action.range.startContainer, action.range.startOffset);
			range.setEnd(action.range.endContainer, action.range.endOffset);

			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);

			this.selManager.splitElementNode3();

		}


	}

	getLatestAction()
	{
		return this.actionStack[this.currentStep];
	}

}