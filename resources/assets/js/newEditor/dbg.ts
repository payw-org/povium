import SelectionManager from "./SelectionManager"
import EditSession from "./EditSession";

export const dbg = function() {
	let d = document.querySelector(".debug")
	d.querySelector(".gcs").addEventListener("click", e => {
		console.log(SelectionManager.getCurrentRange())
	})
	d.querySelector(".gcnl").addEventListener("click", e => {
		console.log(EditSession.nodeList)
	})
}
