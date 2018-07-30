import PostEditor from "./PostEditor"

const editor = new PostEditor(document.querySelector('#post-editor'))

// var a = document.createElement('h1').nodeName
// console.log(a)

document.querySelector('#log-range').addEventListener('click', function () {

	var sel = window.getSelection()

	let rangeCount = sel.rangeCount

	for (let i = 0; i < rangeCount; i++) {
		var range = sel.getRangeAt(i)
		console.log(range)
	}

})

document.querySelector('#nodes-in-selection').addEventListener('click', function () {

	console.log(editor.selManager.getAllNodesInSelection())

})

document.querySelector('#separate').addEventListener('click', function () {

	editor.selManager.splitElementNode2()

})

document.querySelector('#split-text').addEventListener('click', function () {

	editor.selManager.splitTextNode()

})

// document.querySelector('#get-sel-pos').addEventListener('click', function () {

// 	console.log(editor.selManager.getSelectionPosition())

// })

document.querySelector('#get-sel-pos-par').addEventListener('click', function () {

	console.log(editor.selManager.getSelectionPositionInParagraph())

})


// var dom = document.createElement("ol")
// dom.innerHTML = "<li></li>"
// console.log(editor.selManager.isEmptyNode(dom))
// console.log(editor.selManager.isTextEmptyNode(dom))