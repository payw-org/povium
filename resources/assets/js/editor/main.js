import PostEditor from "./PostEditor";


const editor = new PostEditor(document.querySelector('#post-editor'));

// var a = document.createElement('h1').nodeName;
// console.log(a);

document.querySelector('#log-range').addEventListener('click', function () {

	var sel = window.getSelection();

	if (sel.rangeCount === 0) {
		return;
	}

	var range = sel.getRangeAt(0);

	console.log(range.startContainer, range.startOffset);
	console.log(range.endContainer, range.endOffset);

});