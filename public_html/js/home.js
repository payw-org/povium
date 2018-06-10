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
	}


	// Methods
	initHomeUI() {
		// Initialize home UI
		console.log('Initialize home UI');
	}


}

const homeController = new HomeController();
