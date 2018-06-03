<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Povium | Post your vision.</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php include_once $_SERVER['DOCUMENT_ROOT'].'/global-inclusion/global-css.php'; ?>
	<link rel="stylesheet" href="css/home.css?v=1">
	<?php include_once $_SERVER['DOCUMENT_ROOT'].'/global-inclusion/global-script.php'; ?>
</head>
<body>
	<?php include_once $_SERVER['DOCUMENT_ROOT'].'/global-inclusion/globalnav/globalnav.php'; ?>
	<main id="home-main">
		<section id="popular" class="post-section">
			<h1 class="section-title popular">인기 포스트</h1>
			<div class="post-scroll-view">
				<button
					class="previous"
					v-bind:class="{ 'hidden': popularPrevBtnHidden }"
					@click="initScroll();movePopularRight()"
				></button>
				<button
					class="next"
					v-bind:class="{ 'hidden': popularNextBtnHidden }"
					@click="initScroll();movePopularLeft()"
				></button>
				<div
					class="post-container"
					v-bind:style="{	transform: popularScrollStyle }"
					@touchmove="touchScrollMove($event)"
				>
					<?php
					for ($i = 0; $i < 20; $i++) {
					?>
					<div class="post">
						<img class="img" src="assets/images/post-test-img-4.png" alt="">
						<div class="manifesto">
							<h1 class="title">제목 <?php echo $i+1; ?></h1>
							<div class="creator-and-view">
								<a class="creator" href="">Creator<?php echo $i + 1; ?></a>
								<span class="view-count">1234 viewed</span>
							</div>
						</div>
					</div>
					<?php
					}
					?>
				</div>
			</div>

		</section>

		<!-- Category : based on user favorites. -->
		<section id="technology" class="post-section narrow">
			<h1 class="section-title technology">Technology</h1>
			<div class="hero-container">
				<div class="col col--featured">
					<div class="featured">
						<img class="niche" src="/assets/images/wwdc-2018.jpg" alt="wwdc2018">
						<div class="content-wrapper">
							<span class="star">흥행</span>
							<h1 class="title">인기글 제목</h1>
							<p class="copy"></p>
						</div>
					</div>
				</div>
				<div class="col col--list">
					<ol class="post-container">
						<li class="post"></li>
					</ol>
				</div>
			</div>
		</section>
	</main>
	<script src="/js/home.js"></script>
</body>
</html>
