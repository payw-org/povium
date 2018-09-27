<?php
/**
 * Rendering settings for editor page
 *
 * @author 		J.Haemin
 * @copyright 	2018 DesignAndDevelop
 */

return [
	'template_dir' => '/resources/templates/base.phtml',

	'config' => [
		'title' => 'Editor',

		'main' => '/resources/templates/editor-main.phtml',

		'script' => '<script src="/build/js/editor.built.js"></script>',

		'render_globalnav' => false,
		'globalnav_script' => false,
		'render_globalfooter' => false
	]
];
