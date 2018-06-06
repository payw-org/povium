document.querySelector('body').addEventListener('touchstart', function() {
	console.log('touched');
});

var popularScrollView = new Vue({

	el: '#popular',

	data: {
		remUnit: null,
		postWidth: null,
		totalPostNum: 30,
		maxPostNum: null,
		leftOverflowPostNum: 0,
		rightOverflowPostNum: 0,
		postNumToScrollLeft: 0,
		postNumToScrollRight: 0,
		popularScrollStyle: 'translateX(0)',
		popularPrevBtnHidden: true,
		popularNextBtnHidden: true,
		touchPos: 0
	},

	methods: {
		initScroll: function() {
			this.remUnit = window.getComputedStyle(document.documentElement)['font-size'];
			this.postWidth = (1.7 + 17.3) * parseFloat(this.remUnit);

			// Get the max number of posts in window.
			this.maxPostNum = parseInt(window.innerWidth / this.postWidth);
			this.rightOverflowPostNum = this.totalPostNum - this.maxPostNum - this.leftOverflowPostNum;

			this.postNumToScrollLeft = this.maxPostNum;
			this.postNumToScrollRight = this.maxPostNum;

			// Calculate the amount of posts to scroll
			if (this.postNumToScrollLeft > this.leftOverflowPostNum) {
				this.postNumToScrollLeft = this.leftOverflowPostNum;
			}

			if (this.postNumToScrollRight > this.rightOverflowPostNum) {
				this.postNumToScrollRight = this.rightOverflowPostNum;
			}


			if (this.leftOverflowPostNum > 0) {
				this.popularPrevBtnHidden = false;
			} else {
				this.popularPrevBtnHidden = true;
			}
			if (this.rightOverflowPostNum > 0) {
				this.popularNextBtnHidden = false;
			} else {
				this.popularNextBtnHidden = true;
			}

		},

		movePopularLeft: function() {
			this.leftOverflowPostNum += this.postNumToScrollRight;
			this.initScroll();
		},

		movePopularRight: function() {
			this.leftOverflowPostNum -= this.postNumToScrollLeft;
			this.initScroll();
		},

		touchScrollMove: function(e) {
			console.log(e.touches[0].pageX);
		}
	},

	watch: {
		leftOverflowPostNum: function(val) {
			this.popularScrollStyle = 'translateX(-' + 19 * this.leftOverflowPostNum + 'rem)';
		}
	}
});

popularScrollView.initScroll();
