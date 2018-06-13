class HomeController {
	constructor() {
		console.log('A HomeController object has been created.');
		this.homeView = new HomeView();
		this.homeView.autoFlick();
	}
}

class HomeView {
	constructor() {
		console.log('A HomeView object has been created.');

		// DOM elms
		this.popPostContainer = document.querySelector('#popular .post-container');

		this.orgPageX = 0;
		this.dist = 0;
		this.postMax = document.querySelectorAll('#popular .post').length;

		this.popPostContainer.addEventListener('touchstart', (e) => {
			this.dist = 0;
			this.orgPageX = e.touches[0].pageX;

		})

		this.popPostContainer.addEventListener('touchmove', (e) => {
			clearInterval(this.autoFlickInterval);
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

		this.mouseFlag = 0;

		this.popPostContainer.addEventListener('mousedown', (e) => {
			this.dist = 0;
			this.mouseFlag = 1;
			this.orgPageX = e.pageX;
		})

		window.addEventListener('mousemove', (e) => {
			if (!this.mouseFlag) return;
			clearInterval(this.autoFlickInterval);
			this.popPostContainer.classList.add('moving');
			this.dist = e.pageX - this.orgPageX;
			this.popPostContainer.style.transform = 'translate3d(calc(' + (-Number(this.popPostContainer.getAttribute('data-post-pos')) * 100) + "% + " + this.dist + 'px),0,0)';
		})

		window.addEventListener('mouseup', (e) => {
			if (!this.mouseFlag) return;
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
		let start = Number(this.popPostContainer.getAttribute('data-post-pos'));
		this.autoFlickInterval = setInterval(() => {
			start += 1;
			if (start === this.postMax) {
				start = 0;
			}
			this.flickPostTo(start);
		}, 3000);
	}

}

const homeController = new HomeController();


TweenMax.to(".guided-view", 3, {
	x:0,
	ease: Power4.easeInOut
})
