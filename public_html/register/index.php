<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/class/view/TemplateEngine.php';

$te = new TemplateEngine();
$te->render("/template/base.phtml", [
	"title" => "Povium | 시작하기",
	"main" => "template/register.phtml",
	"css" => '<link rel="stylesheet" href="css/register.css">'
]);

?>
