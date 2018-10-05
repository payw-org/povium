import PVMEditSession from "./PVMEditSession"
import PVMEditor from "./PVMEditor"

export default class PVME {
	
	/**
	 * Creates a PVME object.
	 * @param {HTMLElement} container 
	 */
	constructor(container)
	{
		document.execCommand("defaultParagraphSeparator", false, "p")
		this.session = new PVMEditSession(container)
		this.editor = new PVMEditor(this.session)
		let browser = require('detect-browser').detect()
		console.log(browser.name, browser.version)
		if (browser.name.toLowerCase() === 'firefox') {
			console.warn(`The editor's feature does not work with Firefox.`)
		}
	}

}