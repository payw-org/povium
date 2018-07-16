<?php
use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 회원가입",
	"main" => "/resources/templates/register.phtml",
	"script" => '<script src="/build/js/register.built.js"></script>'
]);
