<?php
use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 페이지를 찾을 수 없음",
	"main" => "/resources/templates/404.phtml",
	"script" => '<script src="/build/js/login.built.js"></script>'
]);
