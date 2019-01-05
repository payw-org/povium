import SelectionManager from "./SelectionManager"

export const dbg = function() {
	console.log("hello world")
	let d = document.querySelector(".debug")
	d.querySelector(".gcs").addEventListener("click", e => {
		console.log(SelectionManager.getCurrentRange())
	})
}



