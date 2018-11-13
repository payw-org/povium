function showError(errCode) {

	let errorElm = document.querySelector("#error")
	errorElm.querySelector(".banner").innerHTML = "An error(" + errCode + ") occurred."
	errorElm.classList.remove("hidden")

}

// module.exports = {
// 	showError: showError
// }

export const ErrorManager = {
	showError: showError
}
