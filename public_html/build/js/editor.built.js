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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var editor = new _PostEditor2.default(document.querySelector('#post-editor'));

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

				document.execCommand("defaultParagraphSeparator", false, "p");

				// Event Listeners

				this.domManager.editor.addEventListener('click', function () {
						_this.onSelectionChanged();
				});
				this.domManager.editor.addEventListener('keydown', function (e) {
						_this.onKeyDown(e);
				});
				this.domManager.editor.addEventListener('keyup', function (e) {
						_this.onKeyUp(e);
						_this.onSelectionChanged();
				});
				this.domManager.editor.addEventListener('click', function () {
						_this.onSelectionChanged();
				});

				this.domManager.editor.addEventListener('paste', function (e) {
						_this.onPaste(e);
				});

				// Toolbar button events
				this.domManager.body.addEventListener('click', function (e) {
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

				this.domManager.orderedList.addEventListener('click', function (e) {
						_this.selManager.list('OL');
				});
				// this.domManager.unorderedList.addEventListener('click', (e) => { this.selManager.list('UL'); });
				this.domManager.blockquote.addEventListener('click', function (e) {
						_this.selManager.blockquote('UL');
				});

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

				/**
     * Fires when press keyboard inside the editor.
     * @param {KeyboardEvent} e 
     */

		}, {
				key: "onKeyUp",
				value: function onKeyUp(e) {}
		}, {
				key: "onKeyDown",
				value: function onKeyDown(e) {
						var keyCode = e.which;

						if (keyCode === 13) {

								// Return key
								var selectionNode = this.selManager.getNodeInSelection();
								var selPosType = this.selManager.getSelectionPosition();

								if (this.selManager.isBlockquote(selectionNode)) {

										if (selPosType === 2) {

												e.stopPropagation();
												e.preventDefault();

												var pElm = this.domManager.generateEmptyNode("P");

												this.domManager.editor.insertBefore(pElm, selectionNode.nextSibling);

												var range = document.createRange();
												range.setStartBefore(pElm.firstChild);
												range.collapse(true);

												this.selManager.replaceRange(range);
										} else if (selPosType === 1) {

												e.stopPropagation();
												e.preventDefault();

												// this.selManager.removeSelection();
												this.selManager.splitTextNode();
										}
								}
						}
				}
		}, {
				key: "onSelectionChanged",
				value: function onSelectionChanged() {

						// if (this.isEmpty()) {

						// 	console.log('what');
						// 	this.clearEditor();
						// 	var p = this.domManager.generateEmptyParagraph('p');
						// 	var range = document.createRange();
						// 	range.setStart(p, 0);
						// 	this.domManager.editor.appendChild(p);
						// 	this.selManager.replaceRange(range);
						// 	console.log('Oops, editor seems empty. Now reset it to initial stat.');

						// }

						// If the selection is not in the available elements
						// adjust it.
						var range = this.selManager.getRange();
						if (!range) {
								return;
						}

						var startNode = range.startContainer;
						var startOffset = range.startOffset;
						var endNode = range.endContainer;
						var endOffset = range.endOffset;

						var target;

						var newRange = document.createRange();
						newRange.setStart(startNode, startOffset);
						newRange.setEnd(endNode, endOffset);

						var isChanged = false;

						if (startNode.id === 'editor-body') {

								target = startNode.firstElementChild;

								for (var i = 0; i < startOffset; i++) {
										target = target.nextElementSibling;
								}

								newRange.setStart(target, 0);

								console.log(target);

								isChanged = true;
						}

						if (endNode.id === 'editor-body') {

								target = endNode.firstChild;

								for (var i = 0; i < endOffset - 1; i++) {
										target = target.nextElementSibling;
								}

								newRange.setEnd(target, 1);

								console.log(target);

								isChanged = true;
						}

						if (isChanged) {
								this.selManager.replaceRange(newRange);
								console.log(newRange);
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
				this.body = this.toolbar.querySelector('#p');
				this.heading1 = this.toolbar.querySelector('#h1');
				this.heading2 = this.toolbar.querySelector('#h2');
				this.heading3 = this.toolbar.querySelector('#h3');

				this.boldButton = this.toolbar.querySelector('#bold');
				this.italicButton = this.toolbar.querySelector('#italic');
				this.underlineButton = this.toolbar.querySelector('#underline');
				this.strikeButton = this.toolbar.querySelector('#strike');

				this.alignLeft = this.toolbar.querySelector('#align-left');
				this.alignCenter = this.toolbar.querySelector('#align-center');
				this.alignRight = this.toolbar.querySelector('#align-right');

				this.orderedList = this.toolbar.querySelector('#ol');
				this.unorderedList = this.toolbar.querySelector('#ul');

				this.link = this.toolbar.querySelector('#link');
				this.blockquote = this.toolbar.querySelector('#blockquote');
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

		this.sel = document.getSelection();
		this.range;
		this.startNode;
		this.startOffset;
		this.endNode;
		this.endOffset;

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

				if (!this.isParagraph(chunks[i]) && !this.isHeading(chunks[i]) && !this.isBlockquote(chunks[i])) {
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
			var startNode = orgRange.startContainer;
			var startOffset = orgRange.startOffset;
			var endNode = orgRange.endContainer;
			var endOffset = orgRange.endOffset;

			var chunks = this.getAllNodesInSelection();
			var listElm = document.createElement(type);
			var node;

			var unlockList = true;
			var recordList = [];

			for (var i = 0; i < chunks.length; i++) {

				if (chunks[i].textContent === "") {
					continue;
				}

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

					this.domManager.editor.removeChild(chunks[i]);

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

					this.domManager.editor.removeChild(chunks[i]);
				}
			}

			if (listElm.childElementCount < 1) {
				return;
			}

			this.getRange().insertNode(listElm);

			if (unlockList) {

				var range = document.createRange();
				var itemNode, nextNode;
				var part1 = true,
				    part2 = false,
				    part3 = false;
				var part1ListElm = document.createElement('OL'),
				    part3ListElm = document.createElement('OL');
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
						startNode = newParagraph;
					}

					if (itemNode === endNode) {
						endNode = newParagraph;
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

			var keepRange = document.createRange();
			keepRange.setStart(startNode, startOffset);
			keepRange.setEnd(endNode, endOffset);

			this.replaceRange(keepRange);
		}
	}, {
		key: 'link',
		value: function link(url) {
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
   * Deprecated
   */

	}, {
		key: 'backspace',
		value: function backspace() {

			// this.range.deleteContents();

			// If the selection is collapsed
			// implement default delete action.
			if (this.isEmpty()) {
				console.log(this.startOffset);
				if (this.startOffset === 0) {
					// If the selection is on the beginning

				} else {
					if (this.startNode.nodeType === 3) {
						console.log(this.startNode);
						// TextNode
						var text = this.startNode.textContent;
						var suffixNode;
						var newRange = document.createRange();

						this.startNode.textContent = text.slice(0, this.startOffset - 1) + text.slice(this.startOffset, text.length);

						newRange.setEnd(this.startNode, this.startOffset - 1);
						newRange.collapse(false);
						newRange.insertNode(suffixNode = document.createTextNode(' '));
						newRange.setStartAfter(suffixNode);

						console.log(this.startOffset);

						this.replaceRange(newRange);
					}
				}
			}
		}
	}, {
		key: 'delete',
		value: function _delete() {}
	}, {
		key: 'enter',
		value: function enter() {}

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
			this.domManager.editor.replaceChild(newNode, targetNode);

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
		value: function fixSelection() {}
	}, {
		key: 'splitElementNode',
		value: function splitElementNode() {}

		/**
   * Split text nodes based on the selection.
   */

	}, {
		key: 'splitTextNode',
		value: function splitTextNode() {
			console.log('split');
			var range = this.getRange();
			if (!range) {
				return;
			}
			var startNode = range.startContainer;
			var startOffset = range.startOffset;

			if (startNode.nodeType === 3 && startOffset > 0) {
				startNode.splitText(startOffset);
			}

			range = this.getRange();
			var endNode = range.endContainer;
			var endOffset = range.endOffset;

			if (endNode.nodeType === 3 && endOffset < endNode.textContent.length) {
				endNode.splitText(endOffset);
			}
		}

		/**
   * Remove selection.
   */

	}, {
		key: 'removeSelection',
		value: function removeSelection() {
			this.getRange().deleteContents();
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
		key: 'isAvailableNode',
		value: function isAvailableNode(node) {
			if (this.isParagraph(node) || this.isHeading(node) || this.isList(node) || this.isBlockquote(node) || this.isImageBlock(node)) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		key: 'getSelectionPosition',
		value: function getSelectionPosition() {
			var orgRange = this.getRange();
			var startNode = orgRange.startContainer;
			var startOffset = orgRange.startOffset;
			var endNode = orgRange.endContainer;
			var endOffset = orgRange.endOffset;

			if (!endNode.nextSibling && endNode.textContent.length === endOffset) {
				// console.log('end of the line');
				return 2;
			} else if (!startNode.previousSibling && startOffset === 0) {
				// console.log('start of the line');
				return 0;
			} else {
				// console.log('middle of the night');
				return 1;
			}
		}

		// Getters


		/**
   * @return {Selection}
   */

	}, {
		key: 'getSelection',
		value: function getSelection() {
			return document.getSelection();
		}

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
				} else if (this.isAvailableNode(travelNode)) {
					nodes.push(travelNode);
					if (travelNode.contains(this.getRange().endContainer)) {
						break;
					} else {
						travelNode = travelNode.nextElementSibling;
					}
				} else {
					travelNode = travelNode.parentElement;
				}

				// if (!travelNode || travelNode.nodeName === 'BODY') {

				// 	break;

				// } else if (travelNode.id === 'editor-body') {

				// 	travelNode = travelNode.firstChild;

				// } else if (this.isAvailableNode(travelNode)) {
				// 	nodes.push(travelNode);

				// 	if (travelNode.contains(this.getRange().endContainer)) {
				// 		break;
				// 	} else {
				// 		travelNode = travelNode.nextElementSibling;
				// 	}

				// } else if (travelNode.nextElementSibling === null) {
				// 	travelNode = travelNode.parentNode;
				// } else {
				// 	travelNode = travelNode.nextElementSibling;
				// }
			}

			return nodes;
		}
	}, {
		key: 'getNodeInSelection',
		value: function getNodeInSelection() {

			var travelNode = this.getRange().startContainer;
			if (!travelNode) {
				return;
			}

			while (1) {
				if (this.isAvailableNode(travelNode)) {
					return travelNode;
					break;
				} else {
					travelNode = travelNode.parentElement;
				}
			}
		}
	}, {
		key: 'getCursorPosInParagraph',
		value: function getCursorPosInParagraph() {
			if (this.startOffset === 0) {
				// If the selection is on the beginning
				return 1;
			} else {
				return;
			}
		}
	}]);

	return SelectionManager;
}();

exports.default = SelectionManager;

/***/ })
/******/ ]);
//# sourceMappingURL=editor.built.js.map