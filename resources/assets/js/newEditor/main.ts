import PVMEditor from "./PVMEditor";

const {detect} = require('detect-browser')
const browser = detect()
if (browser) {
	console.log(browser.name)
}

let pvme = new PVMEditor(document.querySelector("#post-editor"))