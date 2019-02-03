import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession";
import Converter from "./Converter";
import Paster from "./Paster";

export const dbg = function() {
	let d = document.querySelector(".debug")
	d.querySelector(".gcn").addEventListener("click", e => {
		console.log(SelectionManager.getCurrentNode())
	})
	d.querySelector(".gcs").addEventListener("click", e => {
		console.log(window.getSelection().getRangeAt(0))
	})
	d.querySelector(".gcpr").addEventListener("click", e => {
		console.log(SelectionManager.getCurrentRange())
	})
	d.querySelector(".gnir").addEventListener("click", e => {
		console.log(SelectionManager.getAllNodesInSelection())
	})
	d.querySelector(".gcnl").addEventListener("click", e => {
		console.log(EditSession.nodeList)
	})
	d.querySelector(".converter-stringify").addEventListener("click", e => {
		console.log(Converter.stringify(EditSession.nodeList))
	})
	d.querySelector(".fpa").addEventListener("click", e => {
		// Converter.fixPasteArea()
		let paster = new Paster()
		paster.convert(document.querySelector("#paste-area"))
	})
	d.querySelector(".fpa-p1").addEventListener("click", e => {
		let paster = new Paster()
		paster.fixElement(document.querySelector("#paste-area"), 1)
	})
	d.querySelector(".fpa-p2").addEventListener("click", e => {
		let paster = new Paster()
		paster.fixElement(document.querySelector("#paste-area"), 2)
	})
	d.querySelector(".fpa-p3").addEventListener("click", e => {
		let paster = new Paster()
		paster.fixElement(document.querySelector("#paste-area"), 3)
	})
	d.querySelector(".fpa-p4").addEventListener("click", e => {
		let paster = new Paster()
		paster.fixElement(document.querySelector("#paste-area"), 4)
	})
}
