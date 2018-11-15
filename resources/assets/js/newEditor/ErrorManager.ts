function showError(errCode: string|number) {

	let errorElm = document.querySelector("#error")
	errorElm.querySelector(".banner").innerHTML = String(errCode)
	errorElm.classList.remove("hidden")

}

// module.exports = {
// 	showError: showError
// }

export const ErrorManager = {
	showError: showError
}
