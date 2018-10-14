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
		this.session.eventManager.setEditor(this.editor)
		let browser = require('detect-browser').detect()
		console.info(browser.name, browser.version)
		if (browser.name.toLowerCase() === 'firefox') {
			console.warn(`Firefox에서는 에디터 기능이 정상적으로 작동하지 않을 수 있습니다. (권장 Firefox 버전: 68 이상)`)
		}
	}

}