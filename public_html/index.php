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
			<h1 class="section-title popular">인기 포스트 30</h1>

			<div class="post-scroll">

				<div class="post-container">

					<?php
					$total_post_num = 5;
					$transform_style = 0;
					for ($i = 0; $i < $total_post_num; $i++) {
						// if ($i == $total_post_num - 1) {
						// 	$transform_style = 'translateX(-100%)';
						// } else {
							$transform_style = 'translateX(' . $i * 100 . '%)';
						// }
					?>
					<div class="post <?php if ($i == 0) { echo 'current'; } ?>"
					     style="transform: <?php echo $transform_style; ?>"
					     data-translateX-percent="<?php echo $i * 100; ?>"
					>
						<img class="img" src="/assets/images/post-test-img-5.png" alt="">
						<div class="manifesto">
							<h1 class="title">제목 <?php echo $i+1; ?></h1>
							<div class="creator-and-view">
								<a class="creator" href="">Creator<?php echo $i + 1; ?></a>
								<span class="view-count">1234 viewed</span>
							</div>
						</div>
					</div>
					<?php
						$transform_percent += 100;
					}
					?>
				</div>

			</div>

		</section>


	</main>
	<script src="/global-inclusion/globalnav/js/view/gn-view.js"></script>
	<script src="/js/home.js"></script>
</body>
</html>
