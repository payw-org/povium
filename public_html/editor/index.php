<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/class/view/TemplateEngine.php';

$te = new TemplateEngine();
$te->render('/src/template/base.phtml', [
	'css' => '<link rel="stylesheet" href="src/build/css/editor.css">',

	'title' => 'Editor',

	'main' => 'src/template/main.phtml',

	'script' => '<script src="src/js/postEditor.js"></script>',

	'render_globalnav' => false,
	'globalnav_script' => false
]);

?>