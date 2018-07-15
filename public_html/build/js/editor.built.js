/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _PostEditor = __webpack_require__(12);

var _PostEditor2 = _interopRequireDefault(_PostEditor);

__webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var editor = new _PostEditor2.default(document.querySelector('#post-editor'));

// var a = document.createElement('h1').nodeName;
// console.log(a);

// document.querySelector('#log-range').addEventListener('click', function () {

// 	var sel = window.getSelection();

// 	if (sel.rangeCount === 0) {
// 		return;
// 	}

// 	var range = sel.getRangeAt(0);

// 	console.log(range.startContainer);
// 	console.log(range.startOffset);
// 	console.log(range.endContainer);
// 	console.log(range.endOffset);

// });

// document.querySelector('#nodes-in-selection').addEventListener('click', function () {

// 	console.log(editor.selManager.getAllNodesInSelection());

// });

// document.querySelector('#separate').addEventListener('click', function () {

// 	editor.selManager.splitElementNode2();

// });

// document.querySelector('#split-text').addEventListener('click', function () {

// 	editor.selManager.splitTextNode();

// });

// document.querySelector('#get-sel-pos').addEventListener('click', function () {

// 	console.log(editor.selManager.getSelectionPosition());

// });

// document.querySelector('#get-sel-pos-par').addEventListener('click', function () {

// 	console.log(editor.selManager.getSelectionPositionInParagraph());

// });


// var dom = document.createElement("ol");
// dom.innerHTML = "<li></li>";
// console.log(editor.selManager.isEmptyNode(dom));
// console.log(editor.selManager.isTextEmptyNode(dom));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DOMManager = __webpack_require__(13);

var _DOMManager2 = _interopRequireDefault(_DOMManager);

var _SelectionManager = __webpack_require__(14);

var _SelectionManager2 = _interopRequireDefault(_SelectionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PostEditor = function () {

	/**
  * Creates a new PostEditor object.
  * @param {HTMLElement} editorDOM
  */
	function PostEditor(editorDOM) {
		var _this = this;

		_classCallCheck(this, PostEditor);

		var self = this;

		this.domManager = new _DOMManager2.default(editorDOM);
		this.selManager = new _SelectionManager2.default(this.domManager);

		this.mouseDownStart = false;

		document.execCommand("defaultParagraphSeparator", false, "p");

		// Event Listeners

		this.domManager.editor.addEventListener('click', function () {
			_this.onSelectionChanged();
		});

		this.domManager.editor.addEventListener('mousedown', function () {
			_this.mouseDownStart = true;
		});
		window.addEventListener('mouseup', function () {
			if (_this.mouseDownStart) {
				_this.mouseDownStart = false;
				// this.onSelectionChanged();
			}
		});

		this.isBackspaceKeyPressed = false;

		window.addEventListener('keydown', function (e) {
			_this.onKeyDown(e);
			_this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('keyup', function (e) {
			_this.onKeyUp(e);

			_this.onSelectionChanged();
		});
		this.domManager.editor.addEventListener('keypress', function (e) {
			_this.onKeyPress(e);
		});

		this.domManager.editor.addEventListener('paste', function (e) {
			_this.onPaste(e);
		});

		// Toolbar button events
		this.domManager.paragraph.addEventListener('click', function (e) {
			_this.selManager.heading('P');
		});
		this.domManager.heading1.addEventListener('click', function (e) {
			_this.selManager.heading('H1');
		});
		this.domManager.heading2.addEventListener('click', function (e) {
			_this.selManager.heading('H2');
		});
		this.domManager.heading3.addEventListener('click', function (e) {
			_this.selManager.heading('H3');
		});

		this.domManager.boldButton.addEventListener('click', function (e) {
			_this.selManager.bold();
		});
		this.domManager.italicButton.addEventListener('click', function (e) {
			_this.selManager.italic();
		});
		this.domManager.underlineButton.addEventListener('click', function (e) {
			_this.selManager.underline();
		});
		this.domManager.strikeButton.addEventListener('click', function (e) {
			_this.selManager.strike();
		});

		this.domManager.alignLeft.addEventListener('click', function (e) {
			_this.selManager.align('left');
		});
		this.domManager.alignCenter.addEventListener('click', function (e) {
			_this.selManager.align('center');
		});
		this.domManager.alignRight.addEventListener('click', function (e) {
			_this.selManager.align('right');
		});

		// this.domManager.orderedList.addEventListener('click', (e) => { this.selManager.list('OL'); });
		// this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('UL'); });
		// this.domManager.link.addEventListener('click', (e) => { this.selManager.link("naver.com"); });
		// this.domManager.blockquote.addEventListener('click', (e) => { this.selManager.blockquote(); });

		this.initEditor();
	}

	// Events


	/**
  *
  * @param {KeyboardEvent} e
  */


	_createClass(PostEditor, [{
		key: "onPaste",
		value: function onPaste(e) {

			var clipboardData = void 0,
			    pastedData = void 0;

			e.stopPropagation();
			e.preventDefault();

			// Get data from clipboard and conver
			clipboardData = e.clipboardData || window.clipboardData;
			pastedData = clipboardData.getData('Text');

			this.selManager.paste(pastedData);
		}
	}, {
		key: "onKeyPress",
		value: function onKeyPress(e) {}

		/**
   * Fires when press keyboard inside the editor.
   * @param {KeyboardEvent} e 
   */

	}, {
		key: "onKeyUp",
		value: function onKeyUp(e) {
			var currentNode = this.selManager.getNodeInSelection();
			if (currentNode && currentNode.textContent !== "" && currentNode.querySelector("br")) {
				currentNode.removeChild(currentNode.querySelector("br"));
			}
		}
	}, {
		key: "onKeyDown",
		value: function onKeyDown(e) {

			var sel = window.getSelection();
			if (sel.rangeCount > 0) {
				if (!this.domManager.editor.contains(sel.getRangeAt(0).startContainer)) {
					console.warn("The given range is not in the editor. Editor's features will work only inside the editor.");
					return;
				}
			}

			var keyCode = e.which;

			// Delete key
			if (keyCode === 8) {

				this.selManager.backspace(e);
			} else if (keyCode === 46) {
				console.log("delete");
				this.selManager.delete(e);
			} else if (keyCode === 13) {

				this.selManager.enter(e);
			}
		}
	}, {
		key: "onSelectionChanged",
		value: function onSelectionChanged() {

			// console.log('selection has been changed');


			this.selManager.fixSelection();
			var range = this.selManager.getRange();
			if (range && !range.collapsed) {
				document.querySelector("#poptool").classList.add("active");
				document.querySelector("#poptool").style.left = range.getBoundingClientRect().left - document.querySelector("#post-editor").getBoundingClientRect().left + range.getBoundingClientRect().width / 2 - document.querySelector("#poptool").getBoundingClientRect().width / 2 + "px";
				console.log(document.querySelector("#post-editor").getBoundingClientRect().top);
				document.querySelector("#poptool").style.top = range.getBoundingClientRect().top - document.querySelector("#post-editor").getBoundingClientRect().top - document.querySelector("#poptool").getBoundingClientRect().height - 5 + "px";
			} else {
				document.querySelector("#poptool").classList.remove("active");
			}
		}

		// Methods

		/**
   * Initialize editor.
   */

	}, {
		key: "initEditor",
		value: function initEditor() {

			// Fix flickering when add text style first time
			// in Chrome browser.
			var emptyNode = document.createElement('p');
			emptyNode.innerHTML = 'a';
			emptyNode.style.opacity = '0';
			this.domManager.editor.appendChild(emptyNode);
			var range = document.createRange();
			range.setStart(emptyNode.firstChild, 0);
			range.setEnd(emptyNode.firstChild, 1);
			this.selManager.replaceRange(range);
			document.execCommand('bold', false);
			this.domManager.editor.removeChild(emptyNode);
			document.getSelection().removeAllRanges();

			// if (this.isEmpty()) {
			// 	this.domManager.editor.innerHTML = "";
			// 	var emptyP = this.domManager.generateEmptyParagraph('p');
			// 	this.domManager.editor.appendChild(emptyP);

			// 	var range = document.createRange();
			// 	range.setStartBefore(emptyP);
			// 	range.collapse(true);

			// 	this.selManager.sel.removeAllRanges();
			// 	this.selManager.sel.addRange(range);
			// }
		}
	}, {
		key: "clearEditor",
		value: function clearEditor() {

			this.domManager.editor.innerHTML = "";
		}

		/**
   * Return true if the editor is empty.
   */

	}, {
		key: "isEmpty",
		value: function isEmpty() {
			var contentInside = this.domManager.editor.textContent;
			var childNodesCount = this.selManager.getAllNodesInSelection().length;
			if (contentInside === "" && childNodesCount < 1) {
				return true;
			} else {
				return false;
			}
		}
	}]);

	return PostEditor;
}();

exports.default = PostEditor;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMManager = function () {

	/**
  * Manages html DOM.
  * @param {HTMLElement} editorDOM
  */
	function DOMManager(editorDOM) {
		_classCallCheck(this, DOMManager);

		this.pHolder = document.createElement('p');
		this.pHolder.innerHTML = '<br>';

		// Editor body
		this.editor = editorDOM.querySelector('#editor-body');

		// Toolbar
		this.toolbar = editorDOM.querySelector('#editor-toolbar');

		// Toolbar buttons
		this.paragraph = editorDOM.querySelector('#p');
		this.heading1 = editorDOM.querySelector('#h1');
		this.heading2 = editorDOM.querySelector('#h2');
		this.heading3 = editorDOM.querySelector('#h3');

		this.boldButton = editorDOM.querySelector('#bold');
		this.italicButton = editorDOM.querySelector('#italic');
		this.underlineButton = editorDOM.querySelector('#underline');
		this.strikeButton = editorDOM.querySelector('#strike');

		this.alignLeft = editorDOM.querySelector('#align-left');
		this.alignCenter = editorDOM.querySelector('#align-center');
		this.alignRight = editorDOM.querySelector('#align-right');

		this.orderedList = editorDOM.querySelector('#ol');
		this.unorderedList = editorDOM.querySelector('#ul');

		this.link = editorDOM.querySelector('#link');
		this.blockquote = editorDOM.querySelector('#blockquote');
	}

	/**
  * 
  * @param  {String} tagName
  * @return {HTMLElement}
  */


	_createClass(DOMManager, [{
		key: 'generateEmptyNode',
		value: function generateEmptyNode(tagName) {
			var elm = document.createElement(tagName);
			var br = document.createElement('br');
			elm.appendChild(br);
			return elm;
		}

		/**
   * Merge two nodes into one node.
   * @param {Node} firstNode 
   * @param {Node} secondNode 
   */

	}, {
		key: 'mergeNodes',
		value: function mergeNodes(firstNode, secondNode) {

			if (firstNode === null || secondNode === null) {
				return;
			}

			var front = firstNode,
			    back = secondNode;

			while (1) {

				if (front.nodeName !== back.nodeName) {
					break;
				}

				if (front.nodeType === 3) {} else {}
			}
		}
	}]);

	return DOMManager;
}();

exports.default = DOMManager;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SelectionManager = function () {

	/**
  * 
  * @param {DOMManager} domManager
  */
	function SelectionManager(domManager) {
		_classCallCheck(this, SelectionManager);

		this.domManager = domManager;
	}

	// Events


	// Methods

	/**
  * Align the selected paragraph.
  * @param {String} direction
  * Left, Center, Right
  */


	_createClass(SelectionManager, [{
		key: 'align',
		value: function align(direction) {

			// document.execCommand('styleWithCSS', true);
			// document.execCommand(direction, false);

			var chunks = this.getAllNodesInSelection();
			var node;

			for (var i = 0; i < chunks.length; i++) {

				if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
					console.warn('The node is not a paragraph nor a heading.');
					continue;
				}

				chunks[i].style.textAlign = direction;
			}
		}

		/**
   * Make the selection bold.
   */

	}, {
		key: 'bold',
		value: function bold() {
			document.execCommand('bold', false);
		}

		/**
   * Make the selection italics.
   */

	}, {
		key: 'italic',
		value: function italic() {
			document.execCommand('italic', false);
		}
	}, {
		key: 'underline',
		value: function underline() {
			document.execCommand('underline', false);
		}
	}, {
		key: 'strike',
		value: function strike() {
			document.execCommand('strikeThrough', false);
		}

		/**
   * 
   * @param {string} type 
   */

	}, {
		key: 'heading',
		value: function heading(type) {

			// # 버그
			// 엔터 치고 첫번째 줄과 두번째 빈 줄 셀렉트 하고
			// heading 적용 시 range 유지 안됨. range가 document 벗어났다고 에러뜸.
			// -> 빈 태그는 heading 적용하지 않음.

			var orgRange = this.getRange();
			if (!orgRange) {
				return;
			}

			var startNode = orgRange.startContainer;
			var startOffset = orgRange.startOffset;
			var endNode = orgRange.endContainer;
			var endOffset = orgRange.endOffset;
			var chunks = this.getAllNodesInSelection();

			for (var i = 0; i < chunks.length; i++) {

				if (chunks[i].nodeName === type) {
					continue;
				}

				// if (chunks[i].textContent === "") {
				// 	continue;
				// }

				if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
					console.warn('The node is not a paragraph nor a heading.');
					continue;
				}

				var changedNode = this.changeNodeName(chunks[i], type);
				if (chunks[i] === startNode) {
					startNode = changedNode;
				}
				if (chunks[i] === endNode) {
					endNode = changedNode;
				}
			}

			var keepRange = document.createRange();
			keepRange.setStart(startNode, startOffset);
			keepRange.setEnd(endNode, endOffset);
			this.replaceRange(keepRange);
		}

		/**
   * 
   * @param {string} type 
   */

	}, {
		key: 'list',
		value: function list(type) {

			// If one or more lists are
			// included in the selection,
			// add other chunks to the existing list.

			// If all selection is already a list
			// restore them to 'P' node.

			var orgRange = this.getRange();
			if (!orgRange) {
				return;
			}

			if (type === undefined) {
				console.error("List type undefined.");
			}

			var startNode = orgRange.startContainer;
			var startOffset = orgRange.startOffset;
			var endNode = orgRange.endContainer;
			var endOffset = orgRange.endOffset;

			var chunks = this.getAllNodesInSelection();
			var listElm = document.createElement(type);
			var placedListElm = false;
			var placedListElmIndex;
			var node;

			var unlockList = true;
			var recordList = [];

			for (var i = 0; i < chunks.length; i++) {

				// if (chunks[i].textContent === "") {
				// 	continue;
				// }

				if (this.isParagraph(chunks[i]) || this.isHeading(chunks[i])) {

					var itemElm = document.createElement('LI');

					while (node = chunks[i].firstChild) {

						itemElm.appendChild(node);
					}

					if (chunks[i] === startNode) {
						startNode = itemElm;
					}

					if (chunks[i] === endNode) {
						endNode = itemElm;
					}

					listElm.appendChild(itemElm);

					if (!placedListElm) {
						placedListElmIndex = i;
						placedListElm = true;
					} else {
						chunks[i].parentNode.removeChild(chunks[i]);
					}

					unlockList = false;
				} else if (this.isList(chunks[i])) {

					// If the node is already a list
					// move items inside to the new list element.

					if (!recordList.includes(chunks[i])) {
						recordList.push(chunks[i]);
					}

					if (recordList.length > 1) {
						unlockList = false;
					}

					while (node = chunks[i].firstChild) {

						listElm.appendChild(node);
					}

					if (!placedListElm) {
						placedListElmIndex = i;
						placedListElm = true;
					} else {
						chunks[i].parentNode.removeChild(chunks[i]);
					}
				}
			}

			if (listElm.childElementCount < 1) {
				return;
			}

			// this.getRange().insertNode(listElm);
			chunks[0].parentNode.replaceChild(listElm, chunks[placedListElmIndex]);

			if (unlockList) {

				var range = document.createRange();
				var itemNode, nextNode;
				var part1 = true,
				    part2 = false,
				    part3 = false;
				var part1ListElm = document.createElement(type),
				    part3ListElm = document.createElement(type);
				var part1ListElmInserted = false,
				    part3ListElmInserted = false;
				var part3Will = false;

				range.setStartAfter(listElm);
				this.replaceRange(range);

				itemNode = listElm.firstChild;
				nextNode = itemNode;

				while (itemNode) {

					nextNode = itemNode.nextElementSibling;

					if (itemNode.nodeName !== "LI") {
						itemNode = itemNode.nextElementSibling;
						continue;
					}

					if (itemNode.contains(startNode)) {
						part1 = false;
						part2 = true;
						part3 = false;
					}

					if (itemNode.contains(endNode)) {
						part3Will = true;
					}

					if (part1) {

						part1ListElm.appendChild(itemNode);

						if (!part1ListElmInserted) {
							range.insertNode(part1ListElm);
							range.setStartAfter(part1ListElm);
							part1ListElmInserted = true;
						}
					} else if (part2) {

						var pElm = document.createElement('P');
						while (node = itemNode.firstChild) {
							pElm.appendChild(node);
						}

						range.insertNode(pElm);
						range.setStartAfter(pElm);
					} else if (part3) {

						part3ListElm.appendChild(itemNode);

						if (!part3ListElmInserted) {
							range.insertNode(part3ListElm);
							range.setStartAfter(part3ListElm);
							part3ListElmInserted = true;
						}
					}

					if (itemNode === startNode) {
						startNode = pElm;
					}

					if (itemNode === endNode) {
						endNode = pElm;
					}

					if (part3Will) {
						part1 = false;
						part2 = false;
						part3 = true;
					}

					itemNode = nextNode;
				}

				if (this.domManager.editor.contains(listElm)) {
					this.domManager.editor.removeChild(listElm);
				}
			}

			console.log(startNode, endNode);

			var keepRange = document.createRange();
			keepRange.setStart(startNode, startOffset);
			keepRange.setEnd(endNode, endOffset);

			this.replaceRange(keepRange);

			this.fixSelection();
		}
	}, {
		key: 'link',
		value: function link(url) {
			var range = this.getRange();
			if (!range) {
				return;
			}

			if (range.collapsed) {
				return;
			}

			document.execCommand('createLink', false, url);
		}
	}, {
		key: 'blockquote',
		value: function blockquote() {
			var orgRange = this.getRange();
			if (!orgRange) {
				return;
			}

			var startNode = orgRange.startContainer;
			var startOffset = orgRange.startOffset;
			var endNode = orgRange.endContainer;
			var endOffset = orgRange.endOffset;
			var chunks = this.getAllNodesInSelection();

			var isAllBlockquote = true;

			for (var i = 0; i < chunks.length; i++) {

				if (chunks[i].nodeName === "BLOCKQUOTE") {
					continue;
				} else {
					isAllBlockquote = false;
				}

				// if (chunks[i].textContent === "") {
				// 	continue;
				// }

				if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i])) {
					console.warn('The node is not a paragraph nor a heading.');
					continue;
				}

				var changedNode = this.changeNodeName(chunks[i], "blockquote", false);
				if (chunks[i] === startNode) {
					startNode = changedNode;
				}
				if (chunks[i] === endNode) {
					endNode = changedNode;
				}
			}

			// Selection is all blockquote
			if (isAllBlockquote) {
				for (var i = 0; i < chunks.length; i++) {
					var changedNode = this.changeNodeName(chunks[i], "P", false);
					if (chunks[i] === startNode) {
						startNode = changedNode;
					}
					if (chunks[i] === endNode) {
						endNode = changedNode;
					}
				}
			}

			var keepRange = document.createRange();
			keepRange.setStart(startNode, startOffset);
			keepRange.setEnd(endNode, endOffset);
			this.replaceRange(keepRange);
		}

		/**
   * Backspace implementation
   */

	}, {
		key: 'backspace',
		value: function backspace(e) {

			// Get current available node
			var currentNode = this.getNodeInSelection();

			var range = this.getRange();
			if (!range.collapsed) {
				e.stopPropagation();
				e.preventDefault();
				this.removeSelection("start");
				return;
			}

			// Backspace key - Empty node
			if (currentNode && this.isAvailableEmptyNode(currentNode)) {

				e.stopPropagation();
				e.preventDefault();

				if ((this.isAvailableChildNode(currentNode) || this.isAvailableParentNode(currentNode)) && this.getPreviousAvailableNode(currentNode)) {

					var previousNode = this.getPreviousAvailableNode(currentNode);

					console.log("empty child node or parent node");

					if (this.isAvailableEmptyNode(previousNode)) {
						previousNode.parentNode.removeChild(previousNode);
					} else {
						var range = document.createRange();
						range.setStartAfter(previousNode.lastChild);
						this.replaceRange(range);

						if (this.isAvailableChildNode(currentNode)) {
							var parentNode = currentNode.parentNode;
							currentNode.parentNode.removeChild(currentNode);
							console.log(parentNode.querySelectorAll("LI"));
							if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
								parentNode.parentNode.removeChild(parentNode);
							}
						} else {
							currentNode.parentNode.removeChild(currentNode);
						}
					}
				} else {
					if (this.isListItem(currentNode)) {
						this.list(currentNode.parentNode.nodeName);
					} else if (this.isAvailableParentNode(currentNode)) {
						this.changeNodeName(currentNode, "P");
					}
				}
			} else if (currentNode && this.getSelectionPositionInParagraph() === 1) {

				// backspace - caret position at start of the node
				e.stopPropagation();
				e.preventDefault();
				console.log("move this line to previous line");

				if ((this.isAvailableChildNode(currentNode) || this.isAvailableParentNode(currentNode)) && this.getPreviousAvailableNode(currentNode)) {

					console.log("child node or parentnode");

					var previousNode = this.getPreviousAvailableNode(currentNode);

					if (this.isAvailableEmptyNode(previousNode)) {
						previousNode.parentNode.removeChild(previousNode);
					} else {

						var node,
						    orgRange = this.getRange();

						var startNode = orgRange.startContainer,
						    startOffset = orgRange.startOffset;
						var endNode = orgRange.endContainer,
						    endOffset = orgRange.endOffset;

						var br = previousNode.querySelector("br");
						if (br) {
							br.parentNode.removeChild(br);
						}

						if (this.isAvailableChildNode(currentNode)) {
							var parentNode = currentNode.parentNode;
							this.mergeNodes(previousNode, currentNode, true);
							if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
								parentNode.parentNode.removeChild(parentNode);
							}
						} else {
							this.mergeNodes(previousNode, currentNode, true);
						}
					}
				}
			}
		}
	}, {
		key: 'delete',
		value: function _delete(e) {
			// Get current available node
			var currentNode = this.getNodeInSelection();

			var range = this.getRange();
			if (!range.collapsed) {
				e.stopPropagation();
				e.preventDefault();
				this.removeSelection("start");
				return;
			}

			// Delete key - Empty node
			if (currentNode && currentNode.textContent.length === 0) {

				e.stopPropagation();
				e.preventDefault();

				if ((this.isAvailableChildNode(currentNode) || this.isAvailableParentNode(currentNode)) && this.getNextAvailableNode(currentNode)) {

					var nextNode = this.getNextAvailableNode(currentNode);

					console.log("empty child node or parent node");

					if (nextNode) {
						var range = document.createRange();
						range.setStartBefore(nextNode.firstChild);
						this.replaceRange(range);

						if (this.isAvailableChildNode(currentNode)) {
							var parentNode = currentNode.parentNode;
							currentNode.parentNode.removeChild(currentNode);
							if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
								parentNode.parentNode.removeChild(parentNode);
							}
						} else {
							currentNode.parentNode.removeChild(currentNode);
						}
					}
				} else {
					var range = document.createRange();
					range.setStart(currentNode, 0);
					range.setEnd(currentNode, 0);
					this.replaceRange(range);
				}
			} else if (currentNode && this.getSelectionPositionInParagraph() === 3) {

				// Delete key - caret position at start of the node
				e.stopPropagation();
				e.preventDefault();
				console.log("pull the next node to current.");

				if ((this.isAvailableChildNode(currentNode) || this.isAvailableParentNode(currentNode)) && this.getNextAvailableNode(currentNode)) {

					var nextNode = this.getNextAvailableNode(currentNode);

					if (nextNode) {

						var br = nextNode.querySelector("br");
						if (br) {
							br.parentNode.removeChild(br);
						}

						if (this.isAvailableChildNode(nextNode)) {
							var parentNode = nextNode.parentNode;
							this.mergeNodes(currentNode, nextNode, true);
							if (this.isList(parentNode) && parentNode.querySelectorAll("LI").length === 0) {
								parentNode.parentNode.removeChild(parentNode);
							}
						} else {
							this.mergeNodes(currentNode, nextNode, true);
						}
					}
				}
			}
		}

		/**
   * Prevents default action and implements a return(enter) key press.
   */

	}, {
		key: 'enter',
		value: function enter(e) {

			// When press return key
			var selectionNode = this.getNodeInSelection();
			var range = this.getRange();
			if (!range.collapsed) {
				e.stopPropagation();
				e.preventDefault();
				this.removeSelection();
				// this.backspace(e);
				console.log(this.getRange());
				console.log("the range is not collapsed");
				return;
			}

			console.log(selectionNode);

			var selPosType = this.getSelectionPositionInParagraph();

			e.stopPropagation();
			e.preventDefault();

			if (selPosType === 2) {
				console.log('middle');
				this.splitElementNode();
			} else if (selPosType === 1) {
				console.log('start');
				var pElm = this.domManager.generateEmptyNode(selectionNode.nodeName);

				selectionNode.parentNode.insertBefore(pElm, selectionNode);
			} else if (selPosType === 3) {
				console.log('end');
				var newNodeName = selectionNode.nodeName;
				var parentNode = selectionNode.parentNode;
				var nextNode = selectionNode.nextSibling;

				if (this.isBlockquote(selectionNode) || this.isHeading(selectionNode)) {
					newNodeName = "P";
				} else if (this.isListItem(selectionNode)) {
					if (this.isEmptyNode(selectionNode)) {

						this.list(selectionNode.parentNode.nodeName);
						return;
					}
				}

				var pElm = this.domManager.generateEmptyNode(newNodeName);

				console.log(pElm);

				console.log(parentNode);

				parentNode.insertBefore(pElm, nextNode);

				var range = document.createRange();
				range.setStartBefore(pElm.firstChild);
				range.collapse(true);

				this.replaceRange(range);
			}
		}

		/**
   * Paste refined data to the selection.
   * @param {String} pastedData
   */

	}, {
		key: 'paste',
		value: function paste(pastedData) {

			var splitted = pastedData.split(/(?:\r\n|\r|\n)/g);

			var range = document.createRange();
			range = this.getRange();

			splitted.forEach(function (paragraph, index) {

				var addedNode;

				var line = paragraph;

				if (index === 0) {
					// line = line.replace(/\s/g, "&nbsp;");
					addedNode = document.createTextNode(line);
				} else {
					addedNode = document.createElement('p');
					line = line.replace(/\s/g, "&nbsp;");
					if (line === "") {
						line = "<br>";
					}
					addedNode.innerHTML = line;
				}

				range.insertNode(addedNode);

				range.setStartAfter(addedNode);
			});

			// console.log(splitted);

			// pastedData = pastedData.replace(/(?:\r\n|\r|\n)/g, '<br>');
		}
	}, {
		key: 'clearRange',
		value: function clearRange() {
			document.getSelection().removeAllRanges();
		}

		/**
   * 
   * @param {Range} range 
   */

	}, {
		key: 'replaceRange',
		value: function replaceRange(range) {
			if (!range) {
				console.warn("range is not available.", range);
				return;
			}
			document.getSelection().removeAllRanges();
			document.getSelection().addRange(range);
		}

		/**
   * Replace the node if the node is inside the editor,
   * else return the new node.
   * @param {HTMLElement} targetNode An HTML element you want to change its node name.
   * @param {String} newNodeName New node name for the target element.
   */

	}, {
		key: 'changeNodeName',
		value: function changeNodeName(targetNode, newNodeName) {
			var keepStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


			// Move all the nodes inside the target node
			// to the new generated node with new node name,
			// as well as preserving the range
			// if the startContainer or the endContainer are included
			// in the original node.

			if (targetNode.nodeType !== 1) {
				// If the node is not an HTML element do nothing.
				return;
			}

			// 1. Change node
			var node;
			var newNode = document.createElement(newNodeName);

			if (keepStyle) {
				newNode.style.textAlign = targetNode.style.textAlign;
			}

			while (node = targetNode.firstChild) {
				newNode.appendChild(node);
			}

			// 3. replace node
			targetNode.parentNode.replaceChild(newNode, targetNode);

			return newNode;
		}

		/**
   * Update selection information.
   */

	}, {
		key: 'updateSelection',
		value: function updateSelection() {}
	}, {
		key: 'fixSelection',
		value: function fixSelection() {

			// If the selection is not in the available elements
			// adjust it.
			var range = this.getRange();
			if (!range) {
				return;
			}

			var startNode = range.startContainer;
			var startOffset = range.startOffset;
			var endNode = range.endContainer;
			var endOffset = range.endOffset;

			var orgS = startNode;
			var orgSO = startOffset;
			var orgE = endNode;
			var orgEO = endOffset;

			var target;

			var newRange = document.createRange();
			newRange.setStart(startNode, startOffset);
			newRange.setEnd(endNode, endOffset);

			var isChanged = false;

			// if (startNode.id === 'editor-body') {
			if (startNode === this.domManager.editor) {

				target = startNode.firstElementChild;

				for (var i = 0; i < startOffset; i++) {
					target = target.nextElementSibling;
				}

				if (target) {

					startNode = target;
					newRange.setStart(startNode, 0);

					isChanged = true;
				}
			}

			// if (endNode.id === 'editor-body') {
			if (endNode === this.domManager.editor) {

				target = endNode.firstChild;

				for (var i = 0; i < endOffset - 1; i++) {
					target = target.nextElementSibling;
				}

				if (target) {
					endNode = target;

					newRange.setEnd(endNode, 1);

					isChanged = true;
				}
			}

			var travelNode;

			if (this.isTextContainNode(startNode)) {

				if (startOffset === 0) {
					travelNode = startNode.firstChild;
					while (1) {
						if (!travelNode) {
							break;
						} else if (travelNode.nodeType === 3) {
							startNode = travelNode;
							newRange.setStart(startNode, 0);
							isChanged = true;
							break;
						} else {
							travelNode = travelNode.firstChild;
						}
					}
				} else if (startOffset > 0) {
					travelNode = startNode.lastChild;
					while (1) {
						if (!travelNode) {
							break;
						} else if (travelNode.nodeType === 3) {
							startNode = travelNode;
							newRange.setStart(startNode, startNode.textContent.length);
							isChanged = true;
							break;
						} else {
							travelNode = travelNode.lastChild;
						}
					}
				}
			}

			if (this.isTextContainNode(endNode)) {

				if (endOffset > 0) {
					travelNode = endNode.lastChild;
					while (1) {
						if (!travelNode) {
							break;
						} else if (travelNode.nodeType === 3) {
							endNode = travelNode;
							newRange.setEnd(endNode, endNode.textContent.length);
							isChanged = true;
							break;
						} else {
							travelNode = travelNode.lastChild;
						}
					}
				} else if (endOffset === 0) {
					travelNode = endNode.firstChild;
					while (1) {
						if (!travelNode) {
							break;
						} else if (travelNode.nodeType === 3) {
							endNode = travelNode;
							newRange.setEnd(endNode, 0);
							isChanged = true;
							break;
						} else {
							travelNode = travelNode.firstChild;
						}
					}
				}
			}

			if (isChanged) {
				// console.log(orgS, orgSO);
				// console.log(orgE, orgEO);
				// console.log(orgS, orgSO);
				// console.log(orgE, orgEO);
				// console.log("fixed selection");
				// console.log(newRange.startContainer, newRange.startOffset);
				// console.log(newRange.endContainer, newRange.endOffset);
				this.replaceRange(newRange);
			}

			startNode = this.getRange().startContainer;
			startOffset = this.getRange().startOffset;
			if (startNode.nodeType === 3 && startNode.textContent === "") {
				startNode.parentNode.normalize();
			}
		}

		/**
   * Implementing return(enter) key inside blockquotes.
   */

	}, {
		key: 'splitElementNode',
		value: function splitElementNode() {

			var range;

			range = this.getRange();

			if (!range) {
				return;
			}

			var startNode = range.startContainer;
			var startOffset = range.startOffset;
			var endNode = range.endContainer;
			var endOffset = range.endOffset;

			var frontNode, backNode;
			var backNodePassed = false;

			var travelNode = startNode;

			var tempNode, nextNode;

			var orgNode;
			var newNode;

			// Loop from the bottom to the top of the node.
			var count = 0;
			while (1) {

				if (this.isAvailableParentNode(travelNode)) {
					break;
				} else if (travelNode.nodeType === 3) {

					if (this.getSelectionPosition() === 1) {
						travelNode = travelNode.parentElement;
						backNode = startNode.parentElement;
						startNode = backNode.previousSibling;
						continue;
					} else {
						if (startOffset === 0) {
							frontNode = startNode.previousSibling;
							backNode = startNode;
						} else {
							this.splitTextNode();
							frontNode = startNode;
							backNode = frontNode.nextSibling;
						}
					}
				} else if (this.isTextStyleNode(travelNode)) {

					if (frontNode === undefined) {}

					if (backNode === undefined) {}
				} else {
					break;
				}

				orgNode = travelNode.parentElement;

				newNode = document.createElement(orgNode.nodeName);

				tempNode = orgNode.firstChild;

				if (!frontNode) {
					frontNode = backNode.previousSibling;
				}

				if (!backNode) {
					backNode = frontNode.nextSibling;
				}

				console.log('-------------------');
				console.log(frontNode, backNode, newNode);

				while (1) {

					if (!tempNode) {
						backNodePassed = false;
						break;
					} else {
						nextNode = tempNode.nextSibling;
					}

					if (tempNode === backNode) {
						backNodePassed = true;
					}

					if (backNodePassed) {
						newNode.appendChild(tempNode);
					}

					tempNode = nextNode;
				}

				if (this.isEmptyNode(orgNode)) {
					orgNode.parentNode.removeChild(orgNode);
					orgNode = null;
				}

				if (!this.isEmptyNode(newNode)) {
					orgNode.parentNode.insertBefore(newNode, orgNode.nextSibling);
				} else {
					newNode = null;
				}

				frontNode = orgNode;
				backNode = newNode;

				// If there is a newNode inserted,
				// move a range to it.
				if (newNode) {
					range.setStart(newNode, 0);
					this.replaceRange(range);
				}

				travelNode = travelNode.parentElement;
			}
		}
	}, {
		key: 'mergeNodes',
		value: function mergeNodes(first, second) {
			var matchTopNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			console.log("merge method runs");

			if (!first || !second) {
				return;
			}

			var front = first,
			    back = second;
			var tempNode;
			var nextFront, nextBack;

			var range = window.getSelection().getRangeAt(0);
			var startNode = this.getTextNodeInElementNode(first, "last");
			var startOffset;
			if (startNode) {
				startOffset = startNode.textContent.length;
			} else {
				startNode = this.getTextNodeInElementNode(second, "first");
				if (startNode) {
					startOffset = 0;
				}
			}

			while (1) {

				console.log("front: ", front, " back: ", back);

				if (!front || !back) {
					break;
				}

				if (front.nodeName !== back.nodeName) {
					if (front === first && back === second && matchTopNode) {} else {
						break;
					}
				}

				if (front.nodeType === 3) {

					front.textContent += back.textContent;
					back.parentNode.removeChild(back);

					if (front.textContent === "" || back.textContent === "") {

						if (front.textContent === "") {
							front = front.previousSibling;
							front.parentNode.removeChild(front);
						}

						if (back.textContent === "") {
							back = back.nextSibling;
							back.parentNode.removeChild(back);
						}

						continue;
					}

					break;
				} else {

					console.log("here");

					nextFront = front.lastChild;
					nextBack = back.firstChild;

					while (tempNode = back.firstChild) {
						front.appendChild(tempNode);
					}

					back.parentNode.removeChild(back);

					front = nextFront;
					back = nextBack;
				}
			}

			if (startNode) {
				var keepRange = document.createRange();
				keepRange.setStart(startNode, startOffset);
				keepRange.setEnd(startNode, startOffset);
				this.replaceRange(keepRange);
			}
		}

		/**
   * Splits text nodes based on the selection and
   * returns start and end node.
   * @return {Object.<Text>}
   */

	}, {
		key: 'splitTextNode',
		value: function splitTextNode() {
			var range = this.getRange();
			if (!range) {
				return;
			}
			var startNode = range.startContainer;
			var startOffset = range.startOffset;

			var returnNode = {
				startNode: null,
				endNode: null
			};

			returnNode.startNode = startNode;

			// Split start of the range.
			if (startNode.nodeType === 3 && startOffset > 0 && startOffset < startNode.textContent.length) {

				returnNode.startNode = startNode.splitText(startOffset);
			}

			range = this.getRange();
			var endNode = range.endContainer;
			var endOffset = range.endOffset;

			returnNode.endNode = endNode;

			// Split end of the range.
			if (startNode !== endNode && endNode.nodeType === 3 && endOffset < endNode.textContent.length) {

				endNode.splitText(endOffset);
			}

			return returnNode;
		}

		/**
   * Remove selection.
   */

	}, {
		key: 'removeSelection',
		value: function removeSelection() {
			var collapseDirection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "end";

			var range = this.getRange();
			var orgRange = range.cloneRange();
			if (!range) {
				return;
			}

			var splitResult = this.splitTextNode();

			var startNode = splitResult.startNode;
			var endNode = splitResult.endNode;

			var deletionDone = false;
			var selectionNode = this.getNodeInSelection();
			var nextParentNode = this.getNextAvailableNode(selectionNode);

			// range.collapse(false);

			range.setStart(range.endContainer, range.endOffset);
			this.replaceRange(range);

			var currentParentNode = selectionNode;
			var travelNode = startNode;
			var nextNode;
			var parentNode;

			while (1) {
				if (!currentParentNode.contains(startNode) && !currentParentNode.contains(endNode)) {
					console.log("nothing contains");
					console.log(currentParentNode.textContent);
					currentParentNode.parentNode.removeChild(currentParentNode);
				} else if (currentParentNode.contains(startNode) && !currentParentNode.contains(endNode)) {
					travelNode = startNode;
					console.log("only contains startnode");
					console.log(currentParentNode.textContent);
					var metCurrentNode = false;

					var tempRange = document.createRange();
					tempRange.setStart(startNode, 0);
					tempRange.setEndAfter(currentParentNode.lastChild);

					tempRange.deleteContents();

					if (this.isTextEmptyNode(currentParentNode)) {
						currentParentNode.innerHTML = "";
						currentParentNode.appendChild(document.createElement("br"));
					}
				} else if (!currentParentNode.contains(startNode) && currentParentNode.contains(endNode)) {
					travelNode = endNode;
					console.log("only contains endnode");
					console.log(currentParentNode.textContent);

					var tempRange = document.createRange();
					tempRange.setStartBefore(currentParentNode.firstChild);
					tempRange.setEnd(endNode, orgRange.endOffset);

					tempRange.deleteContents();

					if (this.isTextEmptyNode(currentParentNode)) {
						currentParentNode.innerHTML = "";
						currentParentNode.appendChild(document.createElement("br"));
					}
					if (collapseDirection === "start") {
						this.backspace(document.createEvent("KeyboardEvent"));
					}
					break;
				} else if (currentParentNode.contains(startNode) && currentParentNode.contains(endNode)) {
					travelNode = startNode;
					orgRange.deleteContents();
					if (this.isTextEmptyNode(currentParentNode)) {
						currentParentNode.innerHTML = "";
						currentParentNode.appendChild(document.createElement("br"));
					}

					console.log(startNode);
					console.log(endNode);

					if (collapseDirection === "end") {
						this.enter(document.createEvent("KeyboardEvent"));
					}

					break;
				}
				currentParentNode = nextParentNode;
				nextParentNode = this.getNextAvailableNode(nextParentNode);
			}

			// this.fixSelection();

		}

		/**
   * Return true if the selection is empty.
   */

	}, {
		key: 'isEmpty',
		value: function isEmpty() {
			if (document.getSelection().isCollapsed) {
				return true;
			} else {
				return false;
			}
		}

		/**
   * If there isn't any of child nodes including "" text nodes, returns true.
   * And truly clear the node to real empty.
   * @param {HTMLElement} node 
   */

	}, {
		key: 'isEmptyNode',
		value: function isEmptyNode(node) {

			if (node.nodeType === 3) {
				return false;
			}
			var travelNode = node.firstChild;
			var nextNode = travelNode;

			while (1) {

				if (!travelNode) {
					return true;
				}

				nextNode = travelNode.nextSibling;

				if (travelNode.nodeType === 3 && travelNode.textContent === "") {
					node.removeChild(travelNode);
				} else if (travelNode.nodeName !== "BR") {
					return false;
				}

				travelNode = nextNode;
			}
		}
	}, {
		key: 'isTextEmptyNode',
		value: function isTextEmptyNode(node) {
			if (node.nodeType === 3) {
				return false;
			}

			if (node.textContent === "" && !node.querySelector("br")) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isAvailableEmptyNode',
		value: function isAvailableEmptyNode(node) {
			if (node.nodeType === 3) {
				return false;
			}

			if (node.textContent === "" && node.querySelector("br")) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isTextContainNode',
		value: function isTextContainNode(node) {
			if (this.isParagraph(node) || this.isHeading(node) || this.isList(node) || this.isListItem(node) || this.isBlockquote(node)) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isTextStyleNode',
		value: function isTextStyleNode(node) {
			if (this.isBold(node) || this.isItalics(node) || this.isStrike(node) || this.isUnderline(node) || this.isLink(node)) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isBold',
		value: function isBold(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'B' || node.nodeName === 'STRONG') {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isItalics',
		value: function isItalics(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'I' || node.nodeName === 'EM') {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isStrike',
		value: function isStrike(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'STRIKE') {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isUnderline',
		value: function isUnderline(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'U') {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isLink',
		value: function isLink(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'LINK') {
				return true;
			} else {
				return false;
			}
		}

		/**
   * Determine if the given node is a paragraph node which Povium understands.
   * @param {Node} node
   */

	}, {
		key: 'isParagraph',
		value: function isParagraph(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'P') {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isHeading',
		value: function isHeading(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'H1' || node.nodeName === 'H2' || node.nodeName === 'H3' || node.nodeName === 'H4' || node.nodeName === 'H5' || node.nodeName === 'H6') {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isList',
		value: function isList(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'OL' || node.nodeName === 'UL') {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isListItem',
		value: function isListItem(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'LI') {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isBlockquote',
		value: function isBlockquote(node) {
			if (!node) {
				return false;
			} else if (node.nodeName === 'BLOCKQUOTE') {
				return true;
			} else {
				return false;
			}
		}

		/**
   * Returns true if the node is an available image block.
   * @param {HTMLElement} node 
   */

	}, {
		key: 'isImageBlock',
		value: function isImageBlock(node) {
			if (!node) {
				return false;
			} else if (node.classList && node.classList.contains('image-block')) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isAvailableParentNode',
		value: function isAvailableParentNode(node) {
			if (this.isParagraph(node) || this.isHeading(node) || this.isList(node) || this.isBlockquote(node) || this.isImageBlock(node)) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'isAvailableChildNode',
		value: function isAvailableChildNode(node) {
			if (this.isListItem(node)) {
				return true;
			} else {
				return false;
			}
		}

		/**
   * Get the first or last text node inside the HTMLElement
   * @param {HTMLElement} node
   * @param {String} firstOrLast
   * "first" | "last" 
   */

	}, {
		key: 'getTextNodeInElementNode',
		value: function getTextNodeInElementNode(node, firstOrLast) {
			var travelNode = node;
			var returnNode = null;
			if (!node) {
				return null;
			}

			if (firstOrLast === "first") {
				while (1) {
					if (travelNode === null) {
						break;
					} else if (travelNode.nodeType === 3) {
						returnNode = travelNode;
						break;
					} else {
						travelNode = travelNode.firstChild;
					}
				}
			} else if (firstOrLast === "last") {
				while (1) {
					if (travelNode === null) {
						break;
					} else if (travelNode.nodeType === 3) {
						returnNode = travelNode;
						break;
					} else {
						travelNode = travelNode.lastChild;
					}
				}
			} else {
				console.error("Second parameter must be 'first' or 'last'.");
			}

			return returnNode;
		}
	}, {
		key: 'getSelectionPosition',
		value: function getSelectionPosition() {
			var customRange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


			var orgRange;

			if (customRange) {
				orgRange = customRange;
			} else {
				orgRange = this.getRange();
			}

			if (!orgRange) {
				return false;
			}

			var startNode = orgRange.startContainer;
			var startOffset = orgRange.startOffset;
			var endNode = orgRange.endContainer;
			var endOffset = orgRange.endOffset;

			var travelNode;
			var isStart = false;
			var isEnd = false;

			travelNode = startNode.previousSibling;

			while (1) {
				if (!travelNode && startOffset === 0) {
					isStart = true;
					break;
				} else if (!travelNode) {
					break;
				} else if (travelNode.textContent === "") {
					travelNode = travelNode.previousSibling;
				} else {
					break;
				}
			}

			travelNode = endNode.nextSibling;

			while (1) {
				if (!travelNode && endOffset === endNode.textContent.length) {
					isEnd = true;
					break;
				} else if (!travelNode) {
					break;
				} else if (travelNode.textContent === "") {
					travelNode = travelNode.nextSibling;
				} else {
					break;
				}
			}

			if (startNode === endNode && this.isEmptyNode(startNode)) {
				isEnd = true;
			}

			if (isStart) {
				return 1;
			} else if (isEnd) {
				return 3;
			} else {
				return 2;
			}
		}
	}, {
		key: 'getSelectionPositionInParagraph',
		value: function getSelectionPositionInParagraph() {
			var customRange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			var orgRange;

			if (customRange) {
				orgRange = customRange;
			} else {
				orgRange = this.getRange();
			}

			if (!orgRange) {
				return false;
			}

			var startNode = orgRange.startContainer;
			var startOffset = orgRange.startOffset;
			var endNode = orgRange.endContainer;
			var endOffset = orgRange.endOffset;

			var travelNode, parentNode;
			var isStart = false;
			var isEnd = false;

			parentNode = startNode.parentElement;
			travelNode = startNode;

			if (startOffset === 0) {
				while (1) {
					if (this.isAvailableParentNode(travelNode) || this.isAvailableChildNode(travelNode)) {
						isStart = true;
						break;
					} else if (travelNode.previousSibling) {
						if (travelNode.previousSibling.textContent === "" || travelNode.previousSibling.nodeName === "BR") {
							travelNode = travelNode.previousSibling;
						} else {
							isStart = false;
							break;
						}
					} else {
						travelNode = travelNode.parentElement;
					}
				}
			}

			parentNode = endNode.parentElement;
			travelNode = endNode;
			if (endOffset === endNode.textContent.length) {
				while (1) {
					if (this.isAvailableParentNode(travelNode) || this.isAvailableChildNode(travelNode)) {
						isEnd = true;
						break;
					} else if (travelNode.nextSibling) {
						if (travelNode.nextSibling.textContent === "" || travelNode.nextSibling.nodeName === "BR") {
							travelNode = travelNode.nextSibling;
						} else {
							isEnd = false;
							break;
						}
					} else {
						travelNode = travelNode.parentElement;
					}
				}
			}

			if (startNode === endNode && this.isEmptyNode(startNode)) {
				isStart = false;
				isEnd = true;
			}

			if (isStart) {
				return 1;
			} else if (isEnd) {
				return 3;
			} else {
				return 2;
			}
		}

		// Getters


		/**
   * @return {Range}
   */

	}, {
		key: 'getRange',
		value: function getRange() {
			if (document.getSelection().rangeCount > 0) {
				return document.getSelection().getRangeAt(0);
			} else {
				return null;
			}
		}

		/**
   * Returns an array of all available nodes within the selection.
   * @return {Array.<HTMLElement>}
   */

	}, {
		key: 'getAllNodesInSelection',
		value: function getAllNodesInSelection() {

			var travelNode = this.getRange() ? this.getRange().startContainer : null;
			var nodes = [];

			while (1) {

				if (!travelNode) {
					break;
				} else if (this.isAvailableParentNode(travelNode)) {
					nodes.push(travelNode);
					if (travelNode.contains(this.getRange().endContainer)) {
						break;
					} else {
						travelNode = travelNode.nextElementSibling;
					}
				} else {
					travelNode = travelNode.parentElement;
				}
			}

			return nodes;
		}
	}, {
		key: 'getPreviousAvailableNode',
		value: function getPreviousAvailableNode(node) {
			var previousNode = node;
			var travelNode = node.previousSibling;
			var returnNode = null;
			while (1) {
				if (travelNode === null) {
					if (this.isAvailableChildNode(previousNode)) {
						travelNode = previousNode.parentNode.previousSibling;
						previousNode = travelNode;
					} else {
						break;
					}
				} else if (this.isAvailableParentNode(travelNode) || this.isAvailableChildNode(travelNode)) {
					// Find the available node
					if (this.isList(travelNode)) {
						var itemNodes = travelNode.querySelectorAll("LI");
						travelNode = itemNodes[itemNodes.length - 1];
					}
					returnNode = travelNode;
					break;
				} else {
					travelNode = travelNode.previousSibling;
				}
			}

			return returnNode;
		}
	}, {
		key: 'getNextAvailableNode',
		value: function getNextAvailableNode(node) {
			var previousNode = node;
			var travelNode = node.nextSibling;
			var returnNode = null;
			while (1) {
				if (travelNode === null) {
					if (this.isAvailableChildNode(previousNode)) {
						travelNode = previousNode.parentNode.nextSibling;
						previousNode = travelNode;
					} else {
						break;
					}
				} else if (this.isAvailableParentNode(travelNode) || this.isAvailableChildNode(travelNode)) {
					// Find the available node
					if (this.isList(travelNode)) {
						travelNode = travelNode.querySelectorAll("LI")[0];
					}
					returnNode = travelNode;
					break;
				} else {
					travelNode = travelNode.nextSibling;
				}
			}

			return returnNode;
		}
	}, {
		key: 'getNodeInSelection',
		value: function getNodeInSelection() {

			var range = this.getRange();
			if (!range) {
				return;
			}
			var travelNode = this.getRange().startContainer;
			if (travelNode === null) {
				return null;
			}

			while (1) {
				if (travelNode === null) {
					return null;
				} else if (this.isAvailableParentNode(travelNode) || this.isAvailableChildNode(travelNode)) {
					return travelNode;
				} else {
					travelNode = travelNode.parentNode;
				}
			}
		}
	}]);

	return SelectionManager;
}();

exports.default = SelectionManager;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Node.prototype.merge = function (node) {};

/***/ })
/******/ ]);
//# sourceMappingURL=editor.built.js.map