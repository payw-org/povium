<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-meta.php"; ?>
		<title>Document</title>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-css.php"; ?>
		<link rel="stylesheet" href="css/login.css">
	</head>
	<body>
		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/globalnav/globalnav.php"; ?>

		<main id="login-main">
			<h1>Povium 로그인</h1>
			<div class="auth-form">
				<input class="input-basic" type="text" placeholder="사용자 이름 또는 이메일 주소">
				<input class="input-basic" type="text" placeholder="패스워드">
			</div>
		</main>

		<?php include_once $_SERVER['DOCUMENT_ROOT'] . "/global-inclusion/global-script.php"; ?>
	</body>
</html>
