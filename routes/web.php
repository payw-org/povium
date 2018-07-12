<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';

use Povium\Base\Router;
use Povium\Base\MasterFactory;

$router = new Router();

$factory = new MasterFactory();
$auth = $factory->createInstance('\Povium\Auth');

/* Home Page */
$router->get(
	'/',
 	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../views/home.php';
		return true;
	}
);

/* Login Page */
$router->get(
	'/login',
 	function () use ($auth) {
		//	If already logged in, send to home.
		if ($auth->isLoggedIn()) {
			exit(header('Location: /'));
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../views/login.php';
		return true;
	}
);

/* Regsiter Page */
$router->get(
	'/register',
 	function () use ($auth) {
		//	If already logged in, send to home.
		if ($auth->isLoggedIn()) {
			exit(header('Location: /'));
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../views/register.php';
		return true;
	}
);

/* User Home Page (Not User My Page) */
$router->get(
	'/@{readable_id:.+}',
 	function ($readable_id) use ($auth) {
		$readable_id = strtolower($readable_id);

		//	Nonexistent readable id.
		if (false === $user_id = $auth->getID($readable_id)) {
			return false;
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../views/user_home.php';
		return true;
	},
	'user_home'
);

/* Post Page */
$router->get(
	'/@{readable_id:.+}/{post_title:.+}-{post_id:\d+}',
 	function ($readable_id, $post_title, $post_id) {
		//	post_id에 해당하는 포스트가 있는지 체크
		//	없으면 return false
		//	있으면 포스트 작성자의 readable id와 포스트 타이틀을 가져옴
		//	대소문자 무시하고 가져온 readable id와 파라미터 readable_id 값을 비교
		//	대소문자 무시하고 가져온 title과 파라미터 title값을 비교 (가져온 title은 raw한 형태 -> 특문과 공백이 섞여있음)
		//	둘중 하나라도 다르면 올바른 uri로 redirect시킨 후 (header), exit() 시킴
		//	둘다 같으면 포스트페이지 require
		require $_SERVER['DOCUMENT_ROOT'] . '/../views/post.php';
		return true;
	},
 	'post'
);


//	Special Routes
//	User cannot access below routes via uri.
//	DO NOT GENERATE URI FOR BELOW ROUTES

/* 404 Not Found Page */
$router->get(
	'/*',
 	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../views/404.php';
	},
 	'ERR_404'
);

/* 405 Method Not Allowed Page */
$router->get(
	'/*',
 	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../views/405.php';
	},
 	'ERR_405'
);
