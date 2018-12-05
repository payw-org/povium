import Popular from "./popularScroll"
import HomeView from "./popularTransform"

if (document.querySelector("#popular .post-container")) {
	// const homeView = new HomeView()
	const popular = new Popular(document.querySelector("#popular"))
}