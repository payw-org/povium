<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/../class/view/TemplateEngine.php';

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 로그인",
	"main" => "/resources/templates/login-main.phtml",
	"css" => '<link rel="stylesheet" href="/build/css/login.css">',
	"script" => '<script src="/build/js/login.built.js"></script>'
]);

?>
