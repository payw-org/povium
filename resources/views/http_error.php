<?php
use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | " . $title,
	"main" => "/resources/templates/http_error.phtml",

	"msg" => $msg,
	"details" => $details
]);
