<nav id="globalnav" :class="{ 'search-active': classFlags.isSearchActive }">
	
	<div id="gn-backface">
		<div id="gn-container">
			<div id="gn-search">
				<div id="gn-search-input-wrapper">
					<div id="gn-search-ui">
						<input @keyup="handleSearchInputKeyUp($event)"
							@keydown="handleSearchInputKeyDown($event)"
							v-model="searchKeyword"
							id="gn-search-input"
							type="text"
							name=""
							value=""
							placeholder=""
							autocomplete="off"
						>
						<div @click="handleMagnifierClick" class="magnifier"></div>
					</div>
				</div>

				<aside v-bind:class="{ 'active': classFlags.isSearchResultActive }" id="gn-search-result-view">
					<ol id="gn-sr-list">
						<a v-for="item in searchResults"
							v-bind:href="item.link"
							@mouseover="currentItem = item"
							@mouseout="currentItem = ''"
							@touchstart="currentItem = item"
							@touchend="currentItem = ''"
							class="gn-sr-link"
							:class="{ 'hover': (item === currentItem) }"
						>
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
	<div id="gn-search-backface"></div>

</nav>
