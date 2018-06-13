<?php


$title = [
	"장어덮밥을 먹을 수 없게 된다면?",
	"'동네다움'을 지킬 수 있는 방법",
	"여행하며 '현금 관리'를 잘 하는 방법",
	"필름카메라의 번거러움이 좋다",
	"가짜 어른 구별하는 힘을 기르는 방법",
	"사진을 시작한 사람들이 앓는다는 '장비병'"
]

?>

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
						for ($i = 0; $i < 6; $i++) {
						?>
							<li class="post-wrapper">
								<a class="post-link" href="/register"></a>
								<div class="post">
									<img class="hero" src="/assets/images/sets/<?php echo $i + 1; ?>.jpg" alt="">
									<div class="post-contents">
										<h1><?php echo $title[$i]; ?></h1>
									</div>
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
