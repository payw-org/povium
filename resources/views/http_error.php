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
		"title" => "Povium | " . $title,

		"main" => "/resources/templates/http_error.phtml",

		"heading" => $heading,

		"details" => $details
	]
];
