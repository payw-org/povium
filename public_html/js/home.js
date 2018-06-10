class HomeController {
	constructor() {
		console.log('A HomeController object has been created.');
		this.homeView = new HomeView();
	}
}

class HomeView {
	constructor() {
		console.log('A HomeView object has been created.');

		// DOM data

		this.orgPosX = 0;
		this.distance = 0;
		this.slidePos = 0;
		this.popularPosts = document.querySelectorAll('#popular .post');
		for (var i = 0; i < this.popularPosts.length; i++) {
			this.popularPosts[i].addEventListener('touchstart', e => {
				this.orgPosX = e.touches[0].pageX;
			});

			this.popularPosts[i].addEventListener('touchmove', e => {
				document.querySelector('#popular .post-container').classList.add('moving');
				let newPosX = e.touches[0].pageX;
				this.distance = newPosX - this.orgPosX;

				this.popularPosts.forEach((post) => {
					let percent = post.getAttribute('data-translateX-percent');
					post.style.transform = 'translateX(calc(' + percent + '% + ' + this.distance + 'px))';
				});

			});

			this.popularPosts[i].addEventListener('touchend', e => {
				document.querySelector('#popular .post-container').classList.remove('moving');
				this.popularPosts.forEach((post, index) => {
					if (this.distance <= -50) {
						index -= 1;
					} else if (this.distance >= 50) {
						index += 1;
					}
					post.style.transform = 'translateX(' + (index - this.slidePos) * 100 + '%)';
					post.setAttribute('data-translateX-percent', (index - this.slidePos) * 100);
				});
			});
		}
	}


	// Methods
	initHomeUI() {
		// Initialize home UI
		console.log('Initialize home UI');
	}


}

const homeController = new HomeController();
