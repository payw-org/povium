export default class UndoManager {

	constructor () {
		this.actionStack = [];
		this.currentStep = 0;
	}

	recordAction (actionData) {

		this.actionStack.push(actionData);

		console.log(this.actionStack);
	}

	undo () {

		console.log('undo');
		// var snapshotData 

	}

	redo () {
		
	}

}

// Snapshot Data Schema
// var snapshotData = {
// 	type: "",
// 	targetNodes: [
// 		node, node, node
// 	],
// 	location: {
// 		front: node,
// 		end: node
// 	},
// 	range: range
// }