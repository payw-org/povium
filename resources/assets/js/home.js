import {
	TweenMax,
	Power0,
	Power1,
	Power2,
	Power3,
	Power4,
	Expo
} from "gsap/TweenMax"
import WheelEvent from "./WheelEvent"

class HomeView {
	constructor() {

		this.setSizeInfo()

		// DOM elements
		this.popularSect = document.querySelector("#popular")
		this.postView = document.querySelector("#popular .post-view")
		this.popPostContainer = document.querySelector("#popular .post-container")
		this.popPostWrappers = document.querySelectorAll("#popular .post-wrapper")

		this.currentPostIndex = 1
		this.maxPostCount = this.postView.querySelectorAll(".post").length

		this.setSizeInfo()

		// Class variables
		this.orgPageX = 0
		this.orgPageY = 0
		this.distX = 0
		this.distY = 0
		this.postMax = document.querySelectorAll("#popular .post").length
		this.isAutoFlicking = false
		this.isDragged = false

		this.lockVerticalScrolling = false
		this.lockHorizontalScrolling = false

		window.addEventListener("resize", e => {
			this.stopAutoFlick()
			this.setSizeInfo()
			let width = document
				.querySelector("#popular .post-container")
				.getBoundingClientRect().width
			// let index = this.popPostContainer.getAttribute("data-post-pos")
			let index = this.currentPostIndex
			if (index > this.maxPostCount - (this.visiblePostCount - 1)) {
				index =
					index - (this.visiblePostCount - 1 - (this.maxPostCount - index))
			}
			this.currentPostIndex = index
			TweenMax.to(this.popPostContainer, 0, {
				ease: Power0,
				transform: "translateX(" + -(width * (index - 1)) + "px)"
			})
		})

		// setTimeout(() => {
		// this.autoFlick()
		// }, 2000)

		// Touch events on popular posts
		this.popPostContainer.addEventListener("touchstart", e => {
			// e.preventDefault()
			this.stopAutoFlick()
			this.popPostContainer.classList.add("moving")
			this.distX = 0
			this.orgPageX = e.touches[0].pageX
			this.orgPageY = e.touches[0].pageY

			let style = window.getComputedStyle(this.popPostContainer)
			let matrix = new WebKitCSSMatrix(style.webkitTransform)
			this.orgM41 = matrix.m41
			
			TweenMax.to(this.popPostContainer, 0, {
				ease: Power0,
				transform: "translateX(" + (this.orgM41 + this.distX) + "px" + ")"
			})
		})

		this.popPostContainer.addEventListener("touchmove", e => {
			this.distX = e.touches[0].pageX - this.orgPageX
			this.distY = e.touches[0].pageY - this.orgPageY

			var mi = Math.abs(this.distY / this.distX)

			if (
				((mi > 0 && mi < 2) || this.lockVerticalScrolling) &&
				!this.lockHorizontalScrolling
			) {
				if (this.lockVerticalScrolling) {
					// console.log('scroll locked by flag')
				} else {
					// console.log('scroll locked by mi: ', mi)
				}
				this.lockVerticalScrolling = true
				e.preventDefault()

				if (
					(this.currentPostIndex === 1 && this.distX > 0) ||
					((this.currentPostIndex >=
						this.maxPostCount - this.visiblePostCount + 1) &&
						this.distX < 0)
				) {
					this.distX = this.distX / 5
				}
				TweenMax.to(this.popPostContainer, 0, {
					ease: Power0,
					transform: "translateX(" + (this.orgM41 + this.distX) + "px" + ")"
				})
				// this.popPostContainer.style.transform =
				// 	"translate3d(calc(" +
				// 	-Number(this.popPostContainer.getAttribute("data-post-pos")) * 100 +
				// 	"% + " +
				// 	this.distX +
				// 	"px),0,10px)"
			} else if (mi >= 2) {
				this.lockHorizontalScrolling = true
			}
		})

		this.popPostContainer.addEventListener("touchend", e => {
			if (this.lockHorizontalScrolling) {
			} else {
				let postPos = this.currentPostIndex
				if (this.distX < 0 && postPos < this.postMax) {
					postPos += 1
				} else if (this.distX > 0 && postPos > 1) {
					postPos -= 1
				}
				this.popPostContainer.classList.remove("moving")
				this.flickPostTo(postPos, "linear")
				setTimeout(() => {
					this.autoFlick()
				}, 300)
			}

			if (!this.lockHorizontalScrolling && !this.lockVerticalScrolling) {
				if (e.target.querySelector(".post-link")) {
					e.target.querySelector(".post-link").click()
				}
			}

			this.lockVerticalScrolling = false
			this.lockHorizontalScrolling = false
		})

		// Mouse pointer events on popular posts
		this.mouseFlag = 0

		this.popularSect.addEventListener("mouseover", e => {
			this.stopAutoFlick()
		})

		this.popularSect.addEventListener("mouseout", e => {
			this.autoFlick()
		})

		// Fire event when mouse down on popular posts
		this.popPostContainer.addEventListener("mousedown", e => {
			e.preventDefault()
			if (e.which !== 1) {
				return
			}
			this.stopAutoFlick()
			this.popPostContainer.classList.add("moving")
			this.distX = 0
			this.mouseFlag = true
			this.orgPageX = e.pageX
			let style = window.getComputedStyle(this.popPostContainer)
			let matrix = new WebKitCSSMatrix(style.webkitTransform)
			this.orgM41 = matrix.m41

			TweenMax.to(this.popPostContainer, 0, {
				ease: Power0,
				transform: "translateX(" + (this.orgM41 + this.distX) + "px" + ")"
			})
		})

		// Fire event when mouse move on popular posts
		window.addEventListener("mousemove", e => {
			if (!this.mouseFlag) return
			e.preventDefault()
			this.isDragged = true
			this.distX = e.pageX - this.orgPageX
			if (
				(this.currentPostIndex === 1 && this.distX > 0) ||
				((this.currentPostIndex >=
					this.maxPostCount - this.visiblePostCount + 1) &&
					this.distX < 0)
			) {
				this.distX = this.distX / 5
			}
			// this.popPostContainer.style.transform =
			// 	"translateX(" + (this.orgM41 + this.distX) + "px" + ")"
			TweenMax.to(this.popPostContainer, 0, {
				ease: Power0,
				transform: "translateX(" + (this.orgM41 + this.distX) + "px" + ")"
			})
		})

		// Fire event when mouse up on popular posts
		window.addEventListener("mouseup", e => {
			if (!this.mouseFlag) return
			this.mouseFlag = 0
			let postPos = this.currentPostIndex
			if (this.distX < 0 && postPos < this.postMax) {
				postPos += 1
			} else if (this.distX > 0 && postPos > 1) {
				postPos -= 1
			}
			this.popPostContainer.classList.remove("moving")
			this.flickPostTo(postPos, "linear")
			setTimeout(() => {
				this.autoFlick()
			}, 300)

			if (
				e.target.closest &&
				e.target.closest(".post") &&
				!this.isDragged &&
				e.which === 1
			) {
				e.target
					.closest(".post")
					.querySelector(".post-link")
					.click()
			} else {
				this.isDragged = false
			}
		})

		// Popular scroll buttons
		this.popularSect
			.querySelector(".scroll-btn.left")
			.addEventListener("click", e => {
				console.log("click")
				this.flickPostTo(
					this.currentPostIndex - this.visiblePostCount,
					"linear"
				)
			})
		this.popularSect
			.querySelector(".scroll-btn.right", "linear")
			.addEventListener("click", e => {
				this.flickPostTo(
					this.currentPostIndex + this.visiblePostCount,
					"linear"
				)
			})
		
		let amount = 0
		let s = new WheelEvent(this.postView, (e) => {
			e.preventDefault()
			amount += e.deltaX
			if (amount < 0) {
				amount = 0
			}
			let nearestDistance = Infinity
			for (let i = 0; i < this.maxPostCount; i++) {
				if (i * this.postWidth < nearestDistance) {
					nearestDistance = i * this.postWidth
				}
			}
			// window.scrollTo(0, window.scrollY + e.deltaY)
			TweenMax.to(this.popPostContainer, 0.3, {
				ease: Power4.easeOut,
				transform: "translateX(" + -(amount) + "px)"
			})
		})
		// s.onEnd = () => {
		// 	console.log("wheel end")
		// 	let nearestDistance = Infinity
		// 	console.log(amount)
		// 	for (let i = 0; i < this.maxPostCount; i++) {
		// 		console.log(Math.abs(i * this.postWidth - amount))
		// 		if (
		// 			Math.abs(i * this.postWidth - amount) < nearestDistance
		// 		) {
		// 			nearestDistance = Math.abs(i * this.postWidth - amount)
		// 			amount = i * this.postWidth
		// 		}
		// 	}
			
		// 	TweenMax.to(this.popPostContainer, 0.4, {
		// 		ease: Power2.easeOut,
		// 		transform: "translateX(" + -(amount) + "px)"
		// 	})
		// }
		// this.postView.addEventListener("wheel", e => {
		// 	e.preventDefault()
		// 	amount += e.deltaX
		// 	if (amount < 0) {
		// 		amount = 0
		// 	}
		// 	let nearestDistance = Infinity
		// 	for (let i = 0; i < this.maxPostCount; i++) {
		// 		if (i * this.postWidth < nearestDistance) {
		// 			nearestDistance = i * this.postWidth
		// 		}
		// 	}
		// 	amount = nearestDistance
		// 	console.log(amount)
		// 	window.scrollTo(0, window.scrollY + e.deltaY)
		// 	TweenMax.to(this.popPostContainer, 0.4, {
		// 		ease: Power2.easeOut,
		// 		transform: "translateX(" + -(amount) + "px)"
		// 	})
		// })
	}

	// Methods
	initHomeUI() {
		// Initialize home UI
		// console.log('Initialize home UI')
	}

	setSizeInfo() {
		this.postWidth = document
			.querySelector("#popular .post-container")
			.getBoundingClientRect().width

		this.remainPostCount = this.maxPostCount - this.currentPostIndex
		this.screenWidth = window.innerWidth
		this.visiblePostCount = parseInt((this.screenWidth - 20) / this.postWidth)
	}

	flickPostTo(index, ease) {
		this.postWidth = document
			.querySelector("#popular .post-container")
			.getBoundingClientRect().width

		this.remainPostCount = this.maxPostCount - index
		this.screenWidth = window.innerWidth

		this.visiblePostCount = parseInt(this.screenWidth / this.postWidth)

		if (index > this.maxPostCount - (this.visiblePostCount - 1)) {
			if (index > this.maxPostCount) {
				index = 1
			} else {
				index =
					index - (this.visiblePostCount - 1 - (this.maxPostCount - index))
			}
		} else if (index < 1) {
			if (this.currentPostIndex === 1) {
				index = this.maxPostCount - this.visiblePostCount + 1
			} else {
				index = 1
			}
		}

		// Scroll animation
		if (ease === "linear") {
			TweenMax.to(this.popPostContainer, 0.5, {
				ease: Power4.easeOut,
				transform: "translateX(" + -((index - 1) * this.postWidth) + "px)"
			})
		} else {
			TweenMax.to(this.popPostContainer, 1.4, {
				ease: Power4.easeInOut,
				transform: "translateX(" + -((index - 1) * this.postWidth) + "px)"
			})
		}

		this.currentPostIndex = index
	}

	autoFlick() {
		if (this.isAutoFlicking) {
			return
		} else {
			this.isAutoFlicking = 1
		}
		this.autoFlickInterval = setInterval(() => {
			this.flickPostTo(this.currentPostIndex + this.visiblePostCount)
		}, 4000)
	}

	// For testing
	stopAutoFlick() {
		this.isAutoFlicking = 0
		clearInterval(this.autoFlickInterval)
	}
}

class HomeController {
	constructor() {
		// console.log('A HomeController object has been created.')
		this.homeView = new HomeView()
	}
}

if (document.querySelector("#popular .post-container")) {
	const homeController = new HomeController()
}
