import Pjax from "pjax"

export default class PVMPjax {
	static pjax = new Pjax({
		elements: "a:not(.full-load)",
		selectors: [
			"title", "povium-app"
		],
		cacheBust: false
	})

	constructor() {}

	static loadUrl(href: string, options?: []) {
		this.pjax.loadUrl(href, options)
	}
}