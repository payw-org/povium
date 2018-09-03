<?php
/**
* Config array for session
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'session_table' => 'session',

	'gc_maxlifetime' => 259200,		//	60 * 60 * 24 * 3 (3 days)

	'cookie_params' => [
		'name' => 'sid',
		'lifetime' => 31536000,		//	60 * 60 * 24 * 365 (1 year)
		'path' => '/',
		'domain' => '',
		'secure' => false,
		'httponly' => true
	],

	'session_id_length' => 64
];
