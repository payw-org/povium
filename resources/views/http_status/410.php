<?php
use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 만료된 페이지",
	"main" => "/resources/templates/410.phtml",

	"err_msg" => $err_msg
]);
