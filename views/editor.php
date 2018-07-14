<?php

use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render('/resources/templates/base.phtml', [
	'css' => '<link rel="stylesheet" href="/build/css/editor.css">',

	'title' => 'Editor',

	'main' => '/resources/templates/editor-main.phtml',

	'script' => '<script src="/build/js/editor.built.js"></script>',

	'render_globalnav' => false,
	'globalnav_script' => false
]);
