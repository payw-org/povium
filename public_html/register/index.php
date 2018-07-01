<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/../class/view/TemplateEngine.php';

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 회원가입",
	"main" => "/resources/templates/register.phtml",
	"css" => '<link rel="stylesheet" href="/build/css/register.css">',
]);

?>
