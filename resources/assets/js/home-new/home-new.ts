import PostView from "../post-view/post-view"

class Home {
	constructor() {
		window.addEventListener("DOMContentLoaded", e => {
			if (document.querySelector("#home-main")) {
				window.addEventListener("click", e => {
					let target = e.target
					if (target instanceof Element) {
						if (target.closest(".post-item")) {
							console.log("clicked post item in home")
							PostView.active(0)
						}
					}
				})
			}
		})
	}	
}

const home = new Home()