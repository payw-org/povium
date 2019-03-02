import PostView from "../post-view/post-view"
import {
	TweenMax,
	Power0,
	Power1,
	Power2,
	Power3,
	Power4,
	Expo
} from "gsap/TweenMax"

class Home {
	postScrollClicked: boolean = false
	postScrollMoved: boolean = false
	postScrollTarget: Element
	originX: number
	originScrollLeft: number

	constructor() {
		;["DOMContentLoaded", "pjax:complete"].forEach(eventName => {
			window.addEventListener(eventName, e => {
				document.querySelectorAll(".post-container").forEach(elm => {
					let htmlElm = elm as HTMLElement
					if (!htmlElm.onscroll) {
						htmlElm.onscroll = e => {
							this.analyzeScrollBtn(htmlElm.closest(".post-scroll-area"))
						}
					}
				})
			})
		})

		window.addEventListener("click", e => {
			let target = e.target
			if (target instanceof Element) {
				if (target.closest(".post-item") && !this.postScrollMoved) {
					PostView.active(0)
				} else if (target.closest(".post-scroll-area .scroll-btn")) {
					if (target.closest(".post-scroll-area .scroll-btn.left")) {
						this.postScrollAnalyze(target.closest(".post-scroll-area").querySelector(".post-container"), "left")
					} else if (target.closest(".post-scroll-area .scroll-btn.right")) {
						this.postScrollAnalyze(target.closest(".post-scroll-area").querySelector(".post-container"), "right")
					}
				}
			}
		})

		window.addEventListener("mousedown", e => {
			let target = <Element> e.target
			this.postScrollMoved = false
			if (target.closest(".post-container")) {
				e.preventDefault()
				this.postScrollClicked = true
				this.originX = e.clientX
				this.postScrollTarget = target.closest(".post-container")
				this.originScrollLeft = this.postScrollTarget.scrollLeft
			} else {
				this.postScrollClicked = false
			}
		})

		window.addEventListener("mouseup", e => {
			if (this.postScrollClicked) {
				this.postScrollClicked = false
			}			
		})

		window.addEventListener("mousemove", e => {
			if (this.postScrollClicked) {
				let movementX = e.clientX - this.originX
				this.postScrollTarget.scrollLeft = this.originScrollLeft - movementX
				if (Math.abs(movementX) >= 5) {
					this.postScrollMoved = true
				}
			}
		})

		window.addEventListener("mouseover", e => {
			let target = e.target
			if (
				target instanceof Element &&
				target.closest(".post-scroll-area")
			) {
				if (!target.closest(".post-scroll-area").classList.contains("btn-active")) {
					document.querySelectorAll(".post-scroll-area").forEach(elm => {
						elm.classList.remove("btn-active")
					})
					target.closest(".post-scroll-area").classList.add("btn-active")
					this.analyzeScrollBtn(target.closest(".post-scroll-area"))
				}				
			} else {
				document.querySelectorAll(".post-scroll-area").forEach(elm => {
					elm.classList.remove("btn-active")
				})
			}
		})
	}

	postScrollAnalyze(elm: Element, direction: string = "right") {
		let scrollLeftOrigin = elm.scrollLeft
		let postContainerWidth = parseInt(window.getComputedStyle(elm).width)
		let postItems = elm.querySelectorAll(".post-item")
		let computedStyle = window.getComputedStyle(postItems[0])
		let postItemWidth = parseInt(computedStyle.width)
		let maxPostItemCount = Math.floor(postContainerWidth/postItemWidth)
		let leftedItemsCount = 1 + Math.ceil(scrollLeftOrigin/postItemWidth)
		let maxScrollLeft = elm.scrollWidth - elm.clientWidth
		let marginLeft = parseInt(window.getComputedStyle(postItems[0]).marginLeft)
		
		let newScrollLeft
		if (direction === "right") {
			newScrollLeft = (maxPostItemCount + leftedItemsCount - 1) * postItemWidth
		} else if (direction === "left") {
			newScrollLeft = (leftedItemsCount - maxPostItemCount - 1) * postItemWidth
		}

		if (newScrollLeft >= maxScrollLeft) {
			newScrollLeft = maxScrollLeft
		} else if (newScrollLeft <= 0) {
			newScrollLeft = 0
		}

		this.postScrollTo(elm, newScrollLeft)
	}

	postScrollTo(elm: Element, amount: number) {
		TweenMax.to(elm, 0.3, {
			ease: Power0.ease,
			scrollLeft: amount
		})
	}

	analyzeScrollBtn(elm: Element) {
		let postContainer = elm.querySelector(".post-container")
		if (postContainer.scrollLeft <= 1) {
			elm.querySelector(".scroll-btn.left").classList.add("hidden")
		} else {
			elm.querySelector(".scroll-btn.left").classList.remove("hidden")
		}

		let maxScrollLeft = postContainer.scrollWidth - postContainer.clientWidth
		if (postContainer.scrollLeft >= maxScrollLeft - 1) {
			elm.querySelector(".scroll-btn.right").classList.add("hidden")
		} else {
			elm.querySelector(".scroll-btn.right").classList.remove("hidden")
		}
	}
}

const home = new Home()