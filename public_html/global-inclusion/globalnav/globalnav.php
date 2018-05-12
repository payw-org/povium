<nav id="globalnav" :class="{ 'search-active': classFlags.isSearchActive }">
	<div id="gn-backface">
		<div id="gn-container">
			<div id="gn-search">
				<div id="gn-search-input-wrapper">
					<div id="gn-search-ui">
						<input v-on:keyup="handleSearchInput($event)" v-model="searchKeyword" id="gn-search-input" type="text" name="" value="" placeholder="" autocomplete="off">
						<div v-on:click="handleMagnifierClick" class="magnifier"></div>
					</div>
				</div>

				<aside id="gn-search-result-view" :class="{ 'active': classFlags.isSearchResultActive }">
					<ol id="gn-sr-list">
						<a v-for="item in searchResults" v-bind:href="item.link" class="gn-sr-link">
							<li class="gn-sr-item">{{ item.keyword }}</li>
						</a>
					</ol>
				</aside>
			</div>
			<div id="gn-logo-wrapper">
				<a id="gn-home-link" href="/"></a>
			</div>
		</div>
	</div>
</nav>
