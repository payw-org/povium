function showError(errCode) {

	let errorElm = document.querySelector("#error")
	errorElm.querySelector(".banner").innerHTML = "문제(" + errCode + ")가 발생했습니다."
	errorElm.classList.remove("hidden")

}

module.exports = {
	showError: showError
}