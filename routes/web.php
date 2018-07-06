<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';

use Povium\Base\Router;

$router = new Router();

$router->get('/', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/home.php';
});

$router->get('/login', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/login.php';
});

$router->get('/register', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/register.php';
});

$router->get('/@{name:.+}', function ($name) {
	//	존재하는 이름인지 체크 (공백을 하이픈으로 처리)
	//	없으면 return false
	//	있으면 유저페이지 require
	echo "user page: " . rawurldecode($name);
});

$router->get('/@{name:.+}/{title:.+}-{id:\d+}', function ($name, $title, $id) {
	//	id에 해당하는 포스트가 있는지 체크
	//	없으면 return false
	//	있으면 이름과 타이틀 비교할 수 있도록 변환 (공백은 하이픈, 타이틀 특문은 하이픈으로)
	//	id에 해당하는 이름과 타이틀을 param의 이름, 타이틀과 비교
	//	다르면 올바른 url로 redirect시킨 후 (hedaer), exit() 시킴
	//	같으면 포스트페이지 require
	echo "post page: " . rawurldecode($title);
});

$router->get('', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/404.php';
}, 'ERR_404');

$router->get('', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/405.php';
}, 'ERR_405');

?>
