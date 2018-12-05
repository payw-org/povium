import { TweenMax, Power4, Power3 } from "gsap"

export default class Popular {
	popularElem: HTMLElement
	scrollContainer: HTMLElement
	scrollItems: NodeListOf<Element>
	maxPostCount: number
	currentIndex: number = 0
	scrollUnitWidth: number
	autoScrollInterval: NodeJS.Timeout = null

	constructor(popularElem: HTMLElement) {
		this.popularElem = popularElem
		this.scrollContainer = this.popularElem.querySelector(".post-container")
		this.scrollItems = this.popularElem.querySelectorAll(".scroll-item")
		this.maxPostCount = this.scrollItems.length
		this.scrollUnitWidth = this.scrollItems[0].getBoundingClientRect().width

		this.startAutoScroll()

		const scrollButton = class ScrollButton {

		}

		// Events
		window.addEventListener("resize", e => {
			this.scrollUnitWidth = this.scrollItems[0].getBoundingClientRect().width
		})

		;["mouseenter", "mouseover", "touchstart"].forEach(event => {
			this.popularElem.addEventListener(event, e => {
				this.stopAutoScroll()
			})
		})

		;["mouseleave", "touchend"].forEach(event => {
			this.popularElem.addEventListener(event, e => {
				console.log(event)
				setTimeout(() => {
					this.startAutoScroll()
				}, 2000)
			})
		})

		this.scrollContainer.addEventListener("wheel", e => {
			if (this.scrollContainer.scrollLeft === 0 && e.deltaX < 0) {
				e.preventDefault()
			}
		})
	}

	scrollToIndex(index: number) {
		this.currentIndex = index
		let marginRight = parseFloat(window.getComputedStyle(this.scrollItems[0]).marginRight)
		this.removeSnapping()
		TweenMax.to(this.scrollContainer, 1, {
			ease: Power3.easeInOut,
			scrollLeft: index * (this.scrollUnitWidth + marginRight)
		})
	}

	startAutoScroll() {
		if (this.autoScrollInterval) {
			clearInterval(this.autoScrollInterval)
		}
		this.autoScrollInterval = setInterval(() => {
			this.currentIndex++
			if (this.currentIndex >= this.maxPostCount) {
				this.currentIndex = 0
			}
			this.scrollToIndex(this.currentIndex)
		}, 2000)
	}

	stopAutoScroll() {
		clearInterval(this.autoScrollInterval)
		this.autoScrollInterval = null
		this.addSnapping()
	}

	addSnapping() {
		let sl = this.scrollContainer.scrollLeft // Remember the scroll position
		this.scrollContainer.classList.add("snapping")
		this.scrollContainer.scrollLeft = sl // Revert the scroll position
	}
	removeSnapping() {
		let sl = this.scrollContainer.scrollLeft // Remember the scroll position
		this.scrollContainer.classList.remove("snapping")
		this.scrollContainer.scrollLeft = sl // Revert the scroll position
	}
}
