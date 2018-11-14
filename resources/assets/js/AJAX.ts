export default class AJAX
{

	private static httpRequest: XMLHttpRequest

	constructor()
	{
		AJAX.httpRequest = new XMLHttpRequest()
	}

	/**
	 * @param {Object} config
	 * @param {string} config.type get | post
	 * @param {string} config.url
	 * @param {string} config.data JSON data
	 */
	public static chirp (config: {
		type: string
		url: string
		data?: string|object|[]
	}) {

		if (!this.httpRequest) this.httpRequest = new XMLHttpRequest()

		/*
		send type, url, data, success function, fail function
		*/
		let type = "post", url = "", data: string, success: Function, fail: Function, done: Function

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
			if (typeof config['data'] === 'object') {
				data = JSON.stringify(config['data'])
			} else if (typeof config['data'] === 'string') {
				data = config["data"]
			}
		}

		if ("success" in config) {
			success = config["success"]
		}

		if ("fail" in config) {
			fail = config["fail"]
		}

		if ("done" in config) {
			done = config["done"]
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
					let status = this.status
					if (fail) {
						fail(status)
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
