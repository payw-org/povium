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
		<section id="popular">
			<h1 class="section-title popular">Hot 뜨거 뜨거 Hot</h1>
			<div class="post-container">
				<!-- <button class="next"></button> -->
				<?php
				for ($i = 0; $i < 10; $i++) {
				?>
				<div class="post">
					<img class="img" src="assets/images/post-test-img-4.png" alt="">
					<div class="manifesto">
						<h1 class="title">포스트 제목 <?php echo $i+1; ?></h1>
						<p class="contents">포스트 내용 <?php echo $i + 1; ?></p>
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
		</section>
	</main>
	<script src="/js/home.js"></script>
</body>
</html>
