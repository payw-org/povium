class HomeController {
	constructor() {
		console.log('A HomeController object has been created.');
		this.homeView = new HomeView();
	}
}

class HomeView {
	constructor() {
		console.log('A HomeView object has been created.');


		document.querySelector('#popular .guided-view').addEventListener('scroll', function() {
			console.log(this.scrollLeft);
		});


	}


	// Methods
	initHomeUI() {
		// Initialize home UI
		console.log('Initialize home UI');
	}


}

const homeController = new HomeController();

anime({
	targets: '.post-container',
	translateX: 200,
	duration: 2000,
	update: () => document.querySelector('.post-container').scroll(200, 0)
});
