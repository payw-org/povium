<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-meta.php"; ?>
		<title>Povium | 회원가입</title>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-css.php"; ?>
		<link rel="stylesheet" href="css/register.css">
	</head>
	<body>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/globalnav/globalnav.php"; ?>

		<main id="register-main">
			<div class="introduce-header">
				<img class="header-icon" src="/assets/images/writing.svg" alt="">
				<h1>좋은 글, 세상을 바꾸는 힘.</h1>
				<p>지금 가입하여 한 달 동안 무료로<br>모든 프리미엄 포스트를 읽어보세요.</p>
			</div>
			<div class="provider">
				<div class="input-wrapper">
					<input class="username input-basic" type="text" autocomplete="off" spellcheck="false">
					<span class="placeholder">사용자 이름</span>
				</div>
				<div class="input-wrapper">
					<input class="email input-basic" type="email" autocomplete="off" spellcheck="false">
					<span class="placeholder">이메일 주소</span>
				</div>
				<div class="input-wrapper">
					<input class="password input-basic" type="password" autocomplete="off" spellcheck="false">
					<span class="placeholder">암호</span>
				</div>
				<button class="btn-violet">가입하기</button>
			</div>
		</main>

		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-script.php"; ?>
		<script src="js/register.js"></script>
	</body>
</html>
