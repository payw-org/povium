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
			<!-- <h1 class="section-title popular">인기 포스트 30</h1> -->

			<div class="post-view">
				<div class="guided-view">
					<div class="post-container" data-post-pos="0">
					<?php
					for ($i = 0; $i < 10; $i++) {
					?>
						<div class="post-wrapper">
							<div class="post <?php if ($i ==0) echo 'current'; ?>">

							</div>
						</div>
					<?php
					}
					?>
					</div>
				</div>
			</div>

		</section>


	</main>
	<script src="/global-inclusion/globalnav/js/view/gn-view.js"></script>
	<script src="/js/home.js"></script>
</body>
</html>
