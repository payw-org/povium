<!DOCTYPE html>
<html lang="ko" dir="ltr">
<head>
	<title>Povium - Post your vision.</title>
	<link rel="stylesheet" type="text/css" href="css/home.css">
	<?php include_once $_SERVER['DOCUMENT_ROOT'].'/global-inclusion/global-head-link.php'; ?>
	<?php include_once $_SERVER['DOCUMENT_ROOT'].'/global-inclusion/global-head-script.php'; ?>
</head>
<body>
	<?php include_once $_SERVER['DOCUMENT_ROOT'].'/global-inclusion/globalnav/globalnav.php'; ?>
	<main id="home-main">
		<div class="home-search-area">
			<div class="home-search-input-wrapper">
				<div class="magnifier"></div>
				<input class="home-search-input" type="text" name="" value="" placeholder="검색" autocomplete="off">
			</div>
		</div>
		<div id="home-content">
			<section id="hot">
				<h1 class="section-title">Hot</h1>
				<div class="hot-post-scroll">
					<ol class="hot-post-container">
						<li class="hot-post">
							<div class="post-main-image">
								<img src="/images/post-test-img-2.jpg" alt="">
							</div>
							<div class="post-detail">
								<h2 class="title">Learning javascript.</h2>
							</div>
						</li>
						<li class="hot-post">
							<div class="post-main-image">
								<img src="/images/post-test-img.gif" alt="">
							</div>
							<div class="post-detail">
								<h2 class="title">PHP gets better.</h2>
							</div>
						</li>
						<li class="hot-post">
							<div class="post-main-image">
								<img src="/images/post-test-img-3.png" alt="">
							</div>
							<div class="post-detail">
								<h2 class="title">Learning javascript.</h2>
							</div>
						</li>
						<li class="hot-post">

						</li>
						<li class="hot-post">

						</li>
						<li class="hot-post">

						</li>
					</ol>
					<!-- <div class="arrow-right"></div> -->
				</div>
			</section>
		</div>
	</main>
	<script src="js/home.js"></script>
</body>
