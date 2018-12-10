import Popular from "./popularScroll"
import HomeView from "./popularTransform"

;["load", "pjax:complete"].forEach(eventName => {
	window.addEventListener(eventName, e => {
		if (document.querySelector("#popular .post-container")) {
			// const homeView = new HomeView()
			const popular = new Popular(document.querySelector("#popular"))
		}
	})
})
