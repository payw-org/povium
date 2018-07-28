<?php
use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 액세스 거부",
	"main" => "/resources/templates/403.phtml",

	"err_msg" => $err_msg
]);
