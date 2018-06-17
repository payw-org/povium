class EditorModel {

	constructor() {

	}

}

class EditorView {

	constructor () {
		this.editorBody = document.querySelector('#editor-body');

	}

}

class EditorController {

	constructor () {
		
		// Properties
		let self = this;
		this.view = new EditorView();
		this.model = new EditorModel();

		// Event Listeners
		this.view.editorBody.addEventListener('keydown', function () {
			if (self.isEditorEmpty()) {
				console.log('empty');
			}
		});

	}

	/**
	 * Initialize empty editor with <p> tag.
	 */
	initEditor () {
		
	}

	isEditorEmpty () {
		
		let contentInside = this.view.editorBody.textContent;
		if (contentInside === "") {
			return true;
		} else {
			return false;
		}

	}

}

const editor = new EditorController();