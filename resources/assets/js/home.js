class HomeView {
	constructor() {

		// DOM elements
		this.popPostContainer = document.querySelector('#popular .post-container');
		this.popPostWrappers = document.querySelectorAll('#popular .post-wrapper');

		// Class variables
		this.orgPageX = 0;
		this.orgPageY = 0;
		this.distX = 0;
		this.distY = 0;
		this.postMax = document.querySelectorAll('#popular .post').length;
		this.isAutoFlicking = false;
		this.isDragged = false;

		this.lockVerticalScrolling = false;
		this.lockHorizontalScrolling = false;

		// Initializing post view
		// TweenMax.to(".guided-view", 3, {
		// 	x:0,
		// 	ease: Power4.easeInOut
		// })

		// setTimeout(() => {
			this.autoFlick();
		// }, 2000);


		// Touch events on popular posts
		this.popPostContainer.addEventListener('touchstart', (e) => {
			// e.preventDefault();
			this.stopAutoFlick();
			this.popPostContainer.classList.add('moving');
			this.distX = 0;
			this.orgPageX = e.touches[0].pageX;
			this.orgPageY = e.touches[0].pageY;
		});

		this.popPostContainer.addEventListener('touchmove', (e) => {

			this.distX = e.touches[0].pageX - this.orgPageX;
			this.distY = e.touches[0].pageY - this.orgPageY;

			var mi = Math.abs( this.distY / this.distX );

			if (((mi > 0 && mi < 2) || this.lockVerticalScrolling) && !this.lockHorizontalScrolling) {

				if (this.lockVerticalScrolling) {
					// console.log('scroll locked by flag');
				} else {
					// console.log('scroll locked by mi: ', mi);
				}
				this.lockVerticalScrolling = true;
				e.preventDefault();

				if (
					Number(this.popPostContainer.getAttribute('data-post-pos')) === 0 && this.distX > 0 ||
					Number(this.popPostContainer.getAttribute('data-post-pos')) === this.postMax - 1 && this.distX < 0
				) {
					this.distX = this.distX / 5;
				}
				this.popPostContainer.style.transform = 'translate3d(calc(' + (-Number(this.popPostContainer.getAttribute('data-post-pos')) * 100) + "% + " + this.distX + 'px),0,10px)';

			} else if (mi >= 2) {
				this.lockHorizontalScrolling = true;
			}

			
		});

		this.popPostContainer.addEventListener('touchend', (e) => {

			if (this.lockHorizontalScrolling) {

			} else {
				let postPos = Number(this.popPostContainer.getAttribute('data-post-pos'));
				if (this.distX < 0 && postPos < this.postMax - 1) {
					postPos += 1;
				} else if (this.distX > 0 && postPos > 0) {
					postPos -= 1;
				}
				this.popPostContainer.classList.add('ease');
				this.popPostContainer.classList.remove('moving');
				this.flickPostTo(postPos);
				setTimeout(() => {
					this.autoFlick();
				}, 300)
			}

			if (!this.lockHorizontalScrolling && !this.lockVerticalScrolling) {
				if (e.target.querySelector('.post-link')) {
					e.target.querySelector('.post-link').click();
				}
			}

			this.lockVerticalScrolling = false;
			this.lockHorizontalScrolling = false;
			
		});



		// Mouse pointer events on popular posts
		this.mouseFlag = 0;

		this.popPostContainer.addEventListener('mouseover', (e) => {
			this.stopAutoFlick();
		});

		this.popPostContainer.addEventListener('mouseout', (e) => {
			this.autoFlick();
		});

		// Fire event when mouse down on popular posts
		this.popPostContainer.addEventListener('mousedown', (e) => {
			e.preventDefault();
			if (e.which !== 1) {
				return;
			}
			this.stopAutoFlick();
			this.popPostContainer.classList.add('moving');
			this.distX = 0;
			this.mouseFlag = true;
			this.orgPageX = e.pageX;
		});

		// Fire event when mouse move on popular posts
		window.addEventListener('mousemove', (e) => {
			if (!this.mouseFlag) return;
			e.preventDefault();
			this.isDragged = true;
			this.distX = e.pageX - this.orgPageX;
			if (Number(this.popPostContainer.getAttribute('data-post-pos')) === 0 && this.distX > 0 ||
			    Number(this.popPostContainer.getAttribute('data-post-pos')) === this.postMax - 1 && this.distX < 0) {
				this.distX = this.distX / 5;
			}
			this.popPostContainer.style.transform = 'translate3d(calc(' + (-Number(this.popPostContainer.getAttribute('data-post-pos')) * 100) + "% + " + this.distX + 'px),0,10px)';
		});

		// Fire event when mouse up on popular posts
		window.addEventListener('mouseup', (e) => {

			if (!this.mouseFlag) return;
			this.mouseFlag = 0;
			let postPos = Number(this.popPostContainer.getAttribute('data-post-pos'));
			if (this.distX < 0 && postPos < this.postMax - 1) {
				postPos += 1;
			} else if (this.distX > 0 && postPos > 0) {
				postPos -= 1;
			}
			this.popPostContainer.classList.add('ease');
			this.popPostContainer.classList.remove('moving');
			this.flickPostTo(postPos);
			setTimeout(() => {
				this.autoFlick();
			}, 300)

			if (!this.isDragged && e.which === 1) {
				e.target.querySelector('.post-link').click();
			} else {
				this.isDragged = false;
			}

		});

		// this.popPostContainer.addEventListener('mouseover', (e) => {
		// 	console.log('mouseover on popular posts');
		//
		// })


	}


	// Methods
	initHomeUI() {
		// Initialize home UI
		// console.log('Initialize home UI');
	}

	flickPostTo(index) {
		this.popPostContainer.style.transform = 'translate3d(' + -(index * 100) +'%,0,10px)';
		this.popPostContainer.setAttribute('data-post-pos', index);
	}

	autoFlick() {
		
		this.popPostContainer.classList.remove('ease');
		if (this.isAutoFlicking) {
			return;
		} else {
			this.isAutoFlicking = 1;
		}
		let start = Number(this.popPostContainer.getAttribute('data-post-pos'));
		this.autoFlickInterval = setInterval(() => {
			start += 1;
			if (start === this.postMax) {
				start = 0;
			}
			this.flickPostTo(start);
		}, 3000);
	}

	// For testing
	stopAutoFlick() {
		this.isAutoFlicking = 0;
		clearInterval(this.autoFlickInterval);
	}

}

class HomeController {
	constructor() {
		// console.log('A HomeController object has been created.');
		this.homeView = new HomeView();
	}
}

if (document.querySelector('#popular .post-container')) {
	const homeController = new HomeController();
}
