// ajax.js
export default class AJAX {

	constructor () {

		this.httpRequest = new XMLHttpRequest()

		if (window.XMLHttpRequest) { // Firefox, Safari, Chrome
			this.httpRequest = new XMLHttpRequest()
		} else if (window.ActiveXObject) { // IE 8 and over
			this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP")
		}

	}

	/**
	 *
	 * @param {Object} config
	 */
	chirp (config) {
		/*
		send type, url, data, success function, fail function
		*/

		var type = "post", url = "", data = "", success, fail, done

		if ("type" in config) {
			type = config["type"]
		}

		type = type.toLowerCase()

		if ("url" in config) {
			url = config["url"]
		} else {
			console.error("You didn't provide an url for AJAX call.")
			return
		}

		if ("data" in config) {
			data = config["data"]
		}

		if ("success" in config) {

			success = config["success"]

			if (typeof success !== "function") {
				console.error(success, "is not a function.")
				return
			}
		}

		if ("fail" in config) {

			fail = config["fail"]

			if (typeof fail !== "function") {
				console.error(fail, "is not a function.")
				return
			}
		}

		if ("done" in config) {
			done = config["done"]

			if (typeof done !== "function") {
				console.error(done, "is not a function.")
				return
			}
		}


		this.httpRequest.addEventListener('readystatechange', function () {
			if (this.readyState === 4) {

				if (done) {
					done()
				}

				if (this.status === 200) {
					let response = this.responseText
					if (success) {
						success(response)
					}

				} else {
					if (fail) {
						fail()
					}

				}
			}
		})

		this.httpRequest.open(type, url, true)
		if (type !== "get") {
			this.httpRequest.setRequestHeader('Content-type', 'application/json charset=utf-8')
		}

		if (type === "get") {
			this.httpRequest.send()
		} else {
			this.httpRequest.send(data)
		}
	}

}
