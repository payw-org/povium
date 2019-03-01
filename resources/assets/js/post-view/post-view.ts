export default class PostView {
	static eventAttached: boolean = false

	constructor() {}

	static active(postId: number) {
		document.body.classList.add("post-view-active")
		if (!this.eventAttached) {
			document.querySelector(".pv-backface").addEventListener("click", e => {
				this.close()
			})

			window.addEventListener("keydown", e => {
				if (e.key === "Escape") {
					e.preventDefault()
					this.close()
				}
			})

			document.querySelector("#post-view .close-handle").addEventListener("click", e => {
				this.close()
			})

			this.eventAttached = true
		}
	}

	static close() {
		document.body.classList.remove("post-view-active")
	}
}