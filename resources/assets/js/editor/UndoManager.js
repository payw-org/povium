import SelectionManager from "./SelectionManager";

export default class UndoManager {

	constructor()
	{
		this.selManager = new SelectionManager();
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
			console.log('no more action record');
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

			}

		} else if (action.type === "add") {

			for (var i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.parentNode.removeChild(action.nodes[i].target);

			}

		} else if (action.type === "split") {

			for (var i = 0; i < action.nodes.length; i++) {

				action.nodes[i].originalNodeRef.parentNode.replaceChild(action.nodes[i].originalNodeClone, action.nodes[i].originalNodeRef);
				action.nodes[i].newAddedNode.parentNode.removeChild(action.nodes[i].newAddedNode);

			}

		}
		

		this.selManager.replaceRange(action.range);

	}

	redo()
	{
		
		if (this.currentStep >= this.actionStack.length - 1) {
			console.log('no more action to recover');
			return;
		} else {
			console.log('redo');
		}

		this.currentStep++;
		var action = this.actionStack[this.currentStep];
		
		if (action.type === "align") {

			for (var i = 0; i < action.nodes.length; i++) {

				action.nodes[i].target.style.textAlign = action.nodes[i].nextState;

			}
		}

		this.selManager.replaceRange(action.range);

	}

}