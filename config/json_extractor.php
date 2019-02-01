<?php
/**
 * Config array for json extractor.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

return [
	'property' => [
		'type' => 'type',
		'data' => 'data',
		'role' => 'role',
		'url' => 'url'
	],

	'value' => [
		'type' => [
			'plain_text' => 'rawText',
			'image' => 'image'
		],

		'role' => [
			'title' => 'title',
			'subtitle' => 'subtitle',
			'thumbnail' => 'thumbnail'
		]
	]
];
