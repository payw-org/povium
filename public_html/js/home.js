class HomeController {
	constructor() {
		console.log('A HomeController object has been created.');
		this.homeView = new HomeView();
	}
}

class HomeView {
	constructor() {
		console.log('A HomeView object has been created.');

		// DOM elements
		this.popPostContainer = document.querySelector('#popular .post-container');
		this.popPostWrappers = document.querySelectorAll('#popular .post-wrapper');

		// Class variables
		this.orgPageX = 0;
		this.dist = 0;
		this.postMax = document.querySelectorAll('#popular .post').length;
		this.isAutoFlicking = 0;

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
			this.dist = 0;
			this.orgPageX = e.touches[0].pageX;
			this.orgPageY = e.touches[0].pageY;
		})

		this.popPostContainer.addEventListener('touchmove', (e) => {
			e.preventDefault();
			this.popPostContainer.classList.add('moving');
			this.dist = e.touches[0].pageX - this.orgPageX;
			this.popPostContainer.style.transform = 'translate3d(calc(' + (-Number(this.popPostContainer.getAttribute('data-post-pos')) * 100) + "% + " + this.dist + 'px),0,0)';
		})

		this.popPostContainer.addEventListener('touchend', (e) => {
			let postPos = Number(this.popPostContainer.getAttribute('data-post-pos'));
			if (this.dist < 0 && postPos < this.postMax - 1) {
				postPos += 1;
			} else if (this.dist > 0 && postPos > 0) {
				postPos -= 1;
			}
			this.popPostContainer.classList.remove('moving');
			this.flickPostTo(postPos);
			this.autoFlick();
		})



		// Mouse pointer events on popular posts
		this.mouseFlag = 0;

		// Fire event when mouse down on popular posts
		this.popPostContainer.addEventListener('mousedown', (e) => {
			e.preventDefault();
			this.stopAutoFlick();
			e.target.parentElement.classList.add('active');
			this.dist = 0;
			this.mouseFlag = 1;
			this.orgPageX = e.pageX;
		})

		// Fire event when mouse move on popular posts
		window.addEventListener('mousemove', (e) => {
			if (!this.mouseFlag) return;
			e.preventDefault();
			this.popPostContainer.classList.add('moving');
			this.dist = e.pageX - this.orgPageX;
			this.popPostContainer.style.transform = 'translate3d(calc(' + (-Number(this.popPostContainer.getAttribute('data-post-pos')) * 100) + "% + " + this.dist + 'px),0,0)';
		})

		// Fire event when mouse up on popular posts
		window.addEventListener('mouseup', (e) => {
			if (!this.mouseFlag) return;
			this.popPostWrappers.forEach(function(value, index, array) {
				array[index].classList.remove('active');
			});
			this.mouseFlag = 0;
			let postPos = Number(this.popPostContainer.getAttribute('data-post-pos'));
			if (this.dist < 0 && postPos < this.postMax - 1) {
				postPos += 1;
			} else if (this.dist > 0 && postPos > 0) {
				postPos -= 1;
			}
			this.popPostContainer.classList.remove('moving');
			this.flickPostTo(postPos);
			this.autoFlick();
		})

		// this.popPostContainer.addEventListener('mouseover', (e) => {
		// 	console.log('mouseover on popular posts');
		//
		// })


	}


	// Methods
	initHomeUI() {
		// Initialize home UI
		console.log('Initialize home UI');
	}

	flickPostTo(index) {
		this.popPostContainer.style.transform = 'translate3d(' + -(index * 100) +'%,0,0)';
		this.popPostContainer.setAttribute('data-post-pos', index);
	}

	autoFlick() {
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

const homeController = new HomeController();
