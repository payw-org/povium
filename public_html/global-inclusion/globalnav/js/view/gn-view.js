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

			currentItem: "",
			
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
			
			handleSearchInputKeyUp: function(e) {
				if (e.which === 27) {
					this.foldSearchInput();
					return;
				} else if (e.which === 38) {
					// Arrow up key
					if (this.currentItem === "") {
						this.currentItem = this.searchResults[this.searchResults.length - 1];
					} else {
						var nextIndex = this.searchResults.indexOf(this.currentItem) - 1;
						if (nextIndex < 0) {
							nextIndex = this.searchResults.length - 1;
						}
						this.currentItem = this.searchResults[nextIndex];
					}
				} else if (e.which === 40) {
					if (this.currentItem === "") {
						this.currentItem = this.searchResults[0];
					} else {
						var nextIndex = this.searchResults.indexOf(this.currentItem) + 1;
						if (nextIndex >= this.searchResults.length) {
							nextIndex = 0;
						}
						this.currentItem = this.searchResults[nextIndex];
					}
				} else if (e.which === 13) {
					var hovered = document.querySelector('.gn-sr-link.hover');
					if (hovered) {
						hovered.click();
					}
				}
				
				if (this.searchKeyword === "") {
					this.classFlags.isSearchResultActive = false;
				} else {
					this.classFlags.isSearchResultActive = true;
				}
			},

			handleSearchInputKeyDown: function(e) {
				if (e.which === 38 || e.which === 40) {
					e.preventDefault();
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
