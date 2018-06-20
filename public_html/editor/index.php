<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/class/view/TemplateEngine.php';

$te = new TemplateEngine();
$te->render('/template/base.phtml', [
	'css' => '<link rel="stylesheet" href="src/css/editor.css">',

	'title' => 'Editor',

	'main' => 'src/template/main.phtml',

	'script' => '<script src="src/js/postEditor.js"></script>',

	'render_globalnav' => false,
	'globalnav_script' => false
]);

?>