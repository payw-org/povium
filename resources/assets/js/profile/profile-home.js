window.addEventListener("scroll", function() {
	let profileInfo = document.querySelector("#profile-main #info")
	let historyElm = document.querySelector("#profile-main #history")

	if (!profileInfo || !historyElm) {
		return
	}

	let offset = historyElm.getBoundingClientRect().top - 60

	if (offset <= 0) {
		offset = 0
	}

	let scrollTop = document.documentElement.scrollTop || document.body.scrollTop

	let historyElmDistance =
		scrollTop + historyElm.getBoundingClientRect().top - 60

	let afterTransform = (historyElmDistance - offset) / 2
	let afterOpacity = offset / historyElmDistance

	profileInfo.style.transform =
		"translate(0, " +
		afterTransform +
		"px) scale(" +
		(offset + 720) / (historyElmDistance + 720) +
		")"
	profileInfo.style.opacity = afterOpacity
	profileInfo.style.filter = "blur(" + afterTransform / 6 + "px)"
})

document.querySelectorAll(".menu-item").forEach(function(menuItem) {
	menuItem.addEventListener("click", function() {
		document.querySelector(".menu-item.selected").classList.remove("selected")
		this.classList.add("selected")
		document
			.querySelector(".board-container.selected")
			.classList.remove("selected")
		document
			.querySelector(".board-" + this.getAttribute("data-mi-name"))
			.classList.add("selected")
	})
})
