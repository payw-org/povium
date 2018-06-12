<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Povium | Post your vision.</title>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-meta.php"; ?>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-css.php"; ?>
		<link rel="stylesheet" href="css/home.css?v=1">
	</head>
	<body>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/globalnav/globalnav.php"; ?>
		<main id="home-main">
			<section id="popular" class="post-section">
				<!-- <h1 class="section-title popular">인기 포스트 30</h1> -->

				<div class="post-view">
					<div class="guided-view">
						<ul class="post-container" data-post-pos="0">
						<?php
						for ($i = 0; $i < 10; $i++) {
						?>
							<li class="post-wrapper">
								<div class="post <?php if ($i ==0) echo 'current'; ?>">

								</div>
							</li>
						<?php
						}
						?>
					</ul>
					</div>
				</div>

			</section>


		</main>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-script.php"; ?>
		<script src="/js/home.js"></script>
	</body>
</html>
