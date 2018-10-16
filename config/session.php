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
	'gc_probability' => 1000,
	'gc_divisor' => 1000,

	'cookie_params' => [
		'name' => 'sid',
		'lifetime' => 31536000,		//	60 * 60 * 24 * 365 (1 year)
		'path' => '/',
		'domain' => '',
		'secure' => false,
		'httponly' => true
	],

	'session_id_length' => 64,

	'delay_time' => 60				//	Delay time for destroyed session
];
