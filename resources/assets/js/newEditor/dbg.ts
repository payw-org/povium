import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession";
import Converter from "./Converter";

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
}
