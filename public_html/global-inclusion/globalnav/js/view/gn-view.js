$(document).ready(function() {

	$(document).on('click', function(e) {
		if (!document.querySelector('#gn-search-ui').contains(e.target)) {
			globalNav.foldSearchInput();
		}
	})

	var globalNav = new Vue({

		el: '#globalnav',

		data: {

			searchResults: [
				{
					"keyword": "Apple",
					"link": "https://www.apple.com/"
				},
				{
					"keyword": "Google",
					"link": "https://www.google.com/"
				},
				{
					"keyword": "Microsoft",
					"link": "https://www.microsoft.com/"
				}
			],

			searchKeyword: "",

			classFlags: {
				isSearchActive: false,
				isSearchResultActive: false
			}

		},

		methods: {

			expandSearchInput: function() {
				this.classFlags.isSearchActive = true;
				this.$el.querySelector('#gn-search-input').focus();
			},

			foldSearchInput: function() {
				this.classFlags.isSearchActive = false;
				this.classFlags.isSearchResultActive = false;
			},

			handleSearchInput: function(e) {
				if (e.which === 27) {
					this.foldSearchInput();
					return;
				}

				if (this.searchKeyword === "") {
					this.classFlags.isSearchResultActive = false;
				} else {
					this.classFlags.isSearchResultActive = true;
				}
			},

			handleMagnifierClick: function() {
				if ($(this.$el).hasClass('search-active')) {
					// 검색
					console.warn('검색 시작');
				} else {
					this.expandSearchInput();
				}
			}

		}
	})

});
