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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
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

// input.js


exports.default = TextInput;
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
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _TextInput2 = __webpack_require__(2);

var _TextInput3 = _interopRequireDefault(_TextInput2);

var _AJAX = __webpack_require__(7);

var _AJAX2 = _interopRequireDefault(_AJAX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // 로그인 받을 때
// array('email' => '', 'password' => '', 'remember' => bool);
// 로그인 리턴할 때
// array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url');

var SignInInput = function (_TextInput) {
	_inherits(SignInInput, _TextInput);

	function SignInInput(inputDOM) {
		_classCallCheck(this, SignInInput);

		return _possibleConstructorReturn(this, (SignInInput.__proto__ || Object.getPrototypeOf(SignInInput)).call(this, inputDOM));
	}

	return SignInInput;
}(_TextInput3.default);

var identifierInputDOM = document.querySelector('.input-wrapper.identifier input');
var passInputDOM = document.querySelector('.input-wrapper.password input');
var rememberCheckBox = document.querySelector('#auto-chk');

if (identifierInputDOM) {
	var identifierInputObj = new SignInInput(identifierInputDOM);
	var passInputObj = new SignInInput(passInputDOM);
}

var confirmButton = document.querySelector("button.confirm");
confirmButton.addEventListener("click", function () {

	var inputData = {
		identifier: identifierInputDOM.value,
		password: passInputDOM.value,
		remember: rememberCheckBox.checked
	};

	var ajax = new _AJAX2.default();
	ajax.chirp({
		type: "post",
		url: "/login",
		data: "login_inputs=" + JSON.stringify(inputData),
		success: function success(response) {
			var result = JSON.parse(response);
			console.log(response);
			if (result['err']) {
				alert(result['msg']);
			} else {
				window.location.replace(result['redirect']);
			}
		}
	});
});

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
			} else if (type === 'put') {
				this.httpRequest.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			}
			this.httpRequest.send(data);
		}
	}]);

	return AJAX;
}();

exports.default = AJAX;

/***/ })
/******/ ]);
//# sourceMappingURL=login.built.js.map