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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);
module.exports = __webpack_require__(5);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// input.js
document.querySelectorAll(".input-wrapper").forEach(function (self, index) {

	self.addEventListener("focusin", function () {
		this.classList.add("focused");
	});

	self.addEventListener("focusout", function () {
		this.classList.remove("focused");
		if (this.querySelector("input").value !== "") {
			this.classList.add("fixed");
		} else {
			this.classList.remove("fixed");
		}
	});
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GlobalNavView = function () {
	function GlobalNavView() {
		var _this = this;

		_classCallCheck(this, GlobalNavView);

		// Elements
		this.gnDOM = document.querySelector('#globalnav');
		this.gnInputDOM = document.querySelector('#gn-search-input');

		// Attatch event listeners
		window.addEventListener('mousedown', function (e) {
			return _this.handleWindowClickEvent(e);
		});
		window.addEventListener('touchstart', function (e) {
			return _this.handleWindowClickEvent(e);
		});

		document.querySelector('#globalnav .magnifier').addEventListener('click', function (e) {
			_this.handleMagnifierEvent();
		});

		document.querySelector('#gn-search-input').addEventListener('keyup', function (e) {
			if (e.which === 27) {
				_this.foldSearchInput();
			}
		});
	}

	// Methods


	_createClass(GlobalNavView, [{
		key: 'expandSearchInput',
		value: function expandSearchInput() {
			this.gnDOM.classList.add('search-active');
			this.gnInputDOM.focus();
		}
	}, {
		key: 'foldSearchInput',
		value: function foldSearchInput() {
			this.gnDOM.classList.remove('search-active');
			this.gnInputDOM.blur();
		}

		// Determine which action should be run
		// when click magnifier icon in global navigation

	}, {
		key: 'handleMagnifierEvent',
		value: function handleMagnifierEvent() {
			if (this.gnDOM.classList.contains('search-active')) {
				// Start searching (nothing happens)
			} else {
				this.expandSearchInput();
			}
		}
	}, {
		key: 'handleWindowClickEvent',
		value: function handleWindowClickEvent(e) {
			if (!document.querySelector('#gn-search-ui').contains(e.target) && !document.querySelector('#gn-search-result-view').contains(e.target)) {
				this.foldSearchInput();
			}
		}
	}]);

	return GlobalNavView;
}();

var GlobalNavController = function GlobalNavController() {
	_classCallCheck(this, GlobalNavController);

	this.globalNavView = new GlobalNavView();
};

window.onload = function () {
	var globalNavController = new GlobalNavController();
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomeView = function () {
	function HomeView() {
		var _this = this;

		_classCallCheck(this, HomeView);

		// DOM elements
		this.popPostContainer = document.querySelector('#popular .post-container');
		this.popPostWrappers = document.querySelectorAll('#popular .post-wrapper');

		// Class variables
		this.orgPageX = 0;
		this.orgPageY = 0;
		this.distX = 0;
		this.distY = 0;
		this.postMax = document.querySelectorAll('#popular .post').length;
		this.isAutoFlicking = false;
		this.isDragged = false;

		this.lockVerticalScrolling = false;
		this.lockHorizontalScrolling = false;

		// Initializing post view
		// TweenMax.to(".guided-view", 3, {
		// 	x:0,
		// 	ease: Power4.easeInOut
		// })

		// setTimeout(() => {
		this.autoFlick();
		// }, 2000);


		// Touch events on popular posts
		this.popPostContainer.addEventListener('touchstart', function (e) {
			// e.preventDefault();
			_this.stopAutoFlick();
			_this.popPostContainer.classList.add('moving');
			_this.distX = 0;
			_this.orgPageX = e.touches[0].pageX;
			_this.orgPageY = e.touches[0].pageY;
		});

		this.popPostContainer.addEventListener('touchmove', function (e) {

			_this.distX = e.touches[0].pageX - _this.orgPageX;
			_this.distY = e.touches[0].pageY - _this.orgPageY;

			var mi = Math.abs(_this.distY / _this.distX);

			if (isNaN(mi)) {
				mi = 0;
			}

			if ((mi > 0 && mi < 2 || _this.lockVerticalScrolling) && !_this.lockHorizontalScrolling) {

				if (_this.lockVerticalScrolling) {
					console.log('scroll locked by flag');
				} else {
					console.log('scroll locked by mi: ', mi);
				}
				_this.lockVerticalScrolling = true;
				e.preventDefault();

				if (Number(_this.popPostContainer.getAttribute('data-post-pos')) === 0 && _this.distX > 0 || Number(_this.popPostContainer.getAttribute('data-post-pos')) === _this.postMax - 1 && _this.distX < 0) {
					_this.distX = _this.distX / 5;
				}
				_this.popPostContainer.style.transform = 'translate3d(calc(' + -Number(_this.popPostContainer.getAttribute('data-post-pos')) * 100 + "% + " + _this.distX + 'px),0,10px)';
			} else {
				_this.lockHorizontalScrolling = true;
			}
		});

		this.popPostContainer.addEventListener('touchend', function (e) {

			if (_this.lockHorizontalScrolling) {} else {
				var postPos = Number(_this.popPostContainer.getAttribute('data-post-pos'));
				if (_this.distX < 0 && postPos < _this.postMax - 1) {
					postPos += 1;
				} else if (_this.distX > 0 && postPos > 0) {
					postPos -= 1;
				}
				_this.popPostContainer.classList.add('ease');
				_this.popPostContainer.classList.remove('moving');
				_this.flickPostTo(postPos);
				setTimeout(function () {
					_this.autoFlick();
				}, 300);
			}

			_this.lockVerticalScrolling = false;
			_this.lockHorizontalScrolling = false;
		});

		// Mouse pointer events on popular posts
		this.mouseFlag = 0;

		this.popPostContainer.addEventListener('mouseover', function (e) {
			_this.stopAutoFlick();
		});

		this.popPostContainer.addEventListener('mouseout', function (e) {
			_this.autoFlick();
		});

		// Fire event when mouse down on popular posts
		this.popPostContainer.addEventListener('mousedown', function (e) {
			e.preventDefault();
			_this.stopAutoFlick();
			_this.popPostContainer.classList.add('moving');
			_this.distX = 0;
			_this.mouseFlag = true;
			_this.orgPageX = e.pageX;
		});

		// Fire event when mouse move on popular posts
		window.addEventListener('mousemove', function (e) {
			if (!_this.mouseFlag) return;
			e.preventDefault();
			_this.isDragged = true;
			_this.distX = e.pageX - _this.orgPageX;
			if (Number(_this.popPostContainer.getAttribute('data-post-pos')) === 0 && _this.distX > 0 || Number(_this.popPostContainer.getAttribute('data-post-pos')) === _this.postMax - 1 && _this.distX < 0) {
				_this.distX = _this.distX / 5;
			}
			_this.popPostContainer.style.transform = 'translate3d(calc(' + -Number(_this.popPostContainer.getAttribute('data-post-pos')) * 100 + "% + " + _this.distX + 'px),0,10px)';
		});

		// Fire event when mouse up on popular posts
		window.addEventListener('mouseup', function (e) {
			if (!_this.mouseFlag) return;
			_this.mouseFlag = 0;
			var postPos = Number(_this.popPostContainer.getAttribute('data-post-pos'));
			if (_this.distX < 0 && postPos < _this.postMax - 1) {
				postPos += 1;
			} else if (_this.distX > 0 && postPos > 0) {
				postPos -= 1;
			}
			_this.popPostContainer.classList.add('ease');
			_this.popPostContainer.classList.remove('moving');
			_this.flickPostTo(postPos);
			setTimeout(function () {
				_this.autoFlick();
			}, 300);

			if (!_this.isDragged && e.which === 1) {
				e.target.querySelector('.post-link').click();
			} else {
				_this.isDragged = false;
			}
		});

		// this.popPostContainer.addEventListener('mouseover', (e) => {
		// 	console.log('mouseover on popular posts');
		//
		// })

	}

	// Methods


	_createClass(HomeView, [{
		key: 'initHomeUI',
		value: function initHomeUI() {
			// Initialize home UI
			console.log('Initialize home UI');
		}
	}, {
		key: 'flickPostTo',
		value: function flickPostTo(index) {
			this.popPostContainer.style.transform = 'translate3d(' + -(index * 100) + '%,0,10px)';
			this.popPostContainer.setAttribute('data-post-pos', index);
		}
	}, {
		key: 'autoFlick',
		value: function autoFlick() {
			var _this2 = this;

			this.popPostContainer.classList.remove('ease');
			if (this.isAutoFlicking) {
				return;
			} else {
				this.isAutoFlicking = 1;
			}
			var start = Number(this.popPostContainer.getAttribute('data-post-pos'));
			this.autoFlickInterval = setInterval(function () {
				start += 1;
				if (start === _this2.postMax) {
					start = 0;
				}
				_this2.flickPostTo(start);
			}, 3000);
		}

		// For testing

	}, {
		key: 'stopAutoFlick',
		value: function stopAutoFlick() {
			this.isAutoFlicking = 0;
			clearInterval(this.autoFlickInterval);
		}
	}]);

	return HomeView;
}();

var HomeController = function HomeController() {
	_classCallCheck(this, HomeController);

	console.log('A HomeController object has been created.');
	this.homeView = new HomeView();
};

if (document.querySelector('#popular .post-container')) {
	var homeController = new HomeController();
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 로그인 받을 때
// array('email' => '', 'password' => '', 'remember' => bool);
// 로그인 리턴할 때
// array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url');


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _TextInput2 = __webpack_require__(6);

var _TextInput3 = _interopRequireDefault(_TextInput2);

var _AJAX = __webpack_require__(7);

var _AJAX2 = _interopRequireDefault(_AJAX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RegInput = function (_TextInput) {
	_inherits(RegInput, _TextInput);

	function RegInput(inputDOM) {
		_classCallCheck(this, RegInput);

		var _this = _possibleConstructorReturn(this, (RegInput.__proto__ || Object.getPrototypeOf(RegInput)).call(this, inputDOM));

		var self = _this;

		_this.target.addEventListener('keyup', function () {

			clearTimeout(this.wait);

			var inputData = self.target.value;

			if (inputData === "") {
				self.hideMsg();
				return;
			}

			this.wait = setTimeout(function () {
				checkValidation();
			}, 300);
		});

		_this.target.addEventListener('focusout', function () {
			// console.log('focused out');
		});
		return _this;
	}

	return RegInput;
}(_TextInput3.default);

var emailInputDOM = document.querySelector('.input-wrapper.email input');
var nameInputDOM = document.querySelector('.input-wrapper.name input');
var passInputDOM = document.querySelector('.input-wrapper.password input');

if (emailInputDOM) {
	var emailInputObj = new RegInput(emailInputDOM);
	var nameInputObj = new RegInput(nameInputDOM);
	var passInputObj = new RegInput(passInputDOM);
}

function checkValidation() {

	console.log('checking validation...');

	var inputData = {
		email: emailInputDOM.value,
		name: nameInputDOM.value,
		password: passInputDOM.value
	};

	var ajax = new _AJAX2.default();
	ajax.chirp({
		type: "post",
		url: "/test.php",
		data: "register_inputs=" + JSON.stringify(inputData),
		success: function success(response) {
			var result = JSON.parse(response);

			console.log(result);

			if (result['err']) {
				emailInputObj.showMsg(result['email_msg']);
				nameInputObj.showMsg(result['name_msg']);
				passInputObj.showMsg(result['password_msg']);
			} else {
				emailInputObj.hideMsg();
				nameInputObj.hideMsg();
				passInputObj.hideMsg();
			}
		}
	});
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextInput = function () {

	/**
  * 
  * @param {HTMLElement} inputDOM 
  */
	function TextInput(inputDOM) {
		_classCallCheck(this, TextInput);

		this.target = inputDOM;
		this.wrapperElement = inputDOM.parentElement;
	}

	_createClass(TextInput, [{
		key: "showMsg",
		value: function showMsg(message) {

			if (message === "") {

				console.log('no massage');
				this.hideMsg();

				return;
			} else if (this.target.value === "") {

				return;
			} else if (this.wrapperElement.querySelector('.expanded-box')) {

				this.wrapperElement.querySelector('.expanded-box').innerHTML = message;
			} else {
				var errorMsgBox = document.createElement('div');
				errorMsgBox.className = 'expanded-box error-msg-box';
				errorMsgBox.innerHTML = message;
				this.target.classList.add('expanded');
				this.wrapperElement.appendChild(errorMsgBox);
			}

			this.wrapperElement.style.paddingBottom = "1.7rem";
		}
	}, {
		key: "hideMsg",
		value: function hideMsg() {
			this.wrapperElement.style.paddingBottom = "0px";
		}
	}]);

	return TextInput;
}();

exports.default = TextInput;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ajax.js
var AJAX = function () {
	function AJAX() {
		_classCallCheck(this, AJAX);

		this.httpRequest = new XMLHttpRequest();

		if (window.XMLHttpRequest) {
			// Firefox, Safari, Chrome
			this.httpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			// IE 8 and over
			this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	/**
  * 
  * @param {Object} config
  */


	_createClass(AJAX, [{
		key: "chirp",
		value: function chirp(config) {
			/*
   send type, url, data, success function, fail function
   */

			var type = "post",
			    url = "",
			    data = "",
			    success,
			    fail,
			    done;

			if ("type" in config) {
				type = config["type"];
			}

			type = type.toLowerCase();

			if ("url" in config) {
				url = config["url"];
			} else {
				console.error("You didn't provide an url for AJAX call.");
				return;
			}

			if ("data" in config) {
				data = config["data"];
			}

			if ("success" in config) {

				success = config["success"];

				if (typeof success !== "function") {
					console.error(success, "is not a function.");
					return;
				}
			}

			if ("fail" in config) {

				fail = config["fail"];

				if (typeof fail !== "function") {
					console.error(fail, "is not a function.");
					return;
				}
			}

			if ("done" in config) {
				done = config["done"];

				if (typeof done !== "function") {
					console.error(done, "is not a function.");
					return;
				}
			}

			this.httpRequest.addEventListener('readystatechange', function () {
				if (this.readyState === 4) {

					if (done) {
						done();
					}

					if (this.status === 200) {
						var response = this.responseText;
						if (success) {
							success(response);
						}
					} else {
						if (fail) {
							fail();
						}
					}
				}
			});

			this.httpRequest.open(type, url, true);
			if (type === "post") {
				this.httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			}
			this.httpRequest.send(data);
		}
	}]);

	return AJAX;
}();

exports.default = AJAX;

/***/ })
/******/ ]);