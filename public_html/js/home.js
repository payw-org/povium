class HomeController {
	constructor() {
		console.log('A HomeController object has been created.');
		this.homeView = new HomeView();
	}
}

class HomeView {
	constructor() {
		console.log('A HomeView object has been created.');

		// DOM elms
		this.popPostContainer = document.querySelector('#popular .post-container');

		this.orgPageX = 0;
		this.dist = 0;
		this.postMax = 10;

		this.popPostContainer.addEventListener('touchstart', (e) => {
			this.orgPageX = e.touches[0].pageX;
			this.popPostContainer.classList.add('moving');
		})

		this.popPostContainer.addEventListener('touchmove', (e) => {
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
			this.popPostContainer.setAttribute('data-post-pos', postPos);
			this.flickPostTo(postPos);
		})

		this.mouseFlag = 0;

		this.popPostContainer.addEventListener('mousedown', (e) => {
			this.mouseFlag = 1;
			this.orgPageX = e.pageX;
			this.popPostContainer.classList.add('moving');
		})

		window.addEventListener('mousemove', (e) => {
			if (!this.mouseFlag) return;
			this.dist = e.pageX - this.orgPageX;
			this.popPostContainer.style.transform = 'translate3d(calc(' + (-Number(this.popPostContainer.getAttribute('data-post-pos')) * 100) + "% + " + this.dist + 'px),0,0)';
		})

		window.addEventListener('mouseup', (e) => {
			this.mouseFlag = 0;
			let postPos = Number(this.popPostContainer.getAttribute('data-post-pos'));
			if (this.dist < 0 && postPos < this.postMax - 1) {
				postPos += 1;
			} else if (this.dist > 0 && postPos > 0) {
				postPos -= 1;
			}
			this.popPostContainer.classList.remove('moving');
			this.popPostContainer.setAttribute('data-post-pos', postPos);
			this.flickPostTo(postPos);
		})

	}


	// Methods
	initHomeUI() {
		// Initialize home UI
		console.log('Initialize home UI');
	}

	flickPostTo(index) {
		this.popPostContainer.style.transform = 'translate3d(' + -(index * 100) +'%,0,0)';
	}


}

const homeController = new HomeController();
