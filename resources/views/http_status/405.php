<?php
use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 허용되지 않은 메소드",
	"main" => "/resources/templates/405.phtml",
]);
