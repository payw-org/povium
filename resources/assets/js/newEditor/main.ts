import { detect } from "detect-browser"
import { ErrorManager } from "./ErrorManager"
import PVMEditor from "./PVMEditor"
import { dbg } from "./dbg"

const browser = detect()
// if (browser.name === "firefox" && parseInt(browser.version) < 69) {
// 	console.warn("You need FireFox with version at least 69.")
// 	ErrorManager.showError("버전 69 이상의 파이어폭스가 팔요합니다.")
// }

let pvme = new PVMEditor(document.querySelector("#post-editor"))
window.addEventListener("load", e => {
	dbg()
})