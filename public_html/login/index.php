<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-meta.php"; ?>
		<title>Povium | 로그인</title>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-css.php"; ?>
		<link rel="stylesheet" href="css/login.css">
	</head>
	<body>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/globalnav/globalnav.php"; ?>

		<main id="login-main">
			<div class="header">
				<img src="/assets/images/key.svg">
				<h1>로그인</h1>
			</div>
			<div class="auth-form">
				<input class="input-basic" type="text" placeholder="사용자 이름 또는 이메일 주소">
				<input class="input-basic" type="password" placeholder="패스워드">
				<button class="btn-aqua">로그인</button>
				<div class="auto-login">
					<input id="auto-chk" type="checkbox" class="checkbox-violet">
					<label for="auto-chk">자동로그인</label>
				</div>
			</div>
			<span class="pro"><a href="/register">회원가입</a>하고 한 달 동안 무료로 이용해보세요!</span>
		</main>

		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-script.php"; ?>
	</body>
</html>
