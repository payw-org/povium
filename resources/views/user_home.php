<?php
// echo "user: " . $user_id;
use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 로그인",
	"user" => $GLOBALS['auth']->getCurrentUser(),
	"main" => "/resources/templates/my-page/profile-home.phtml",
	"script" => ''
]);