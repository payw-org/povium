<?php
/**
* Config array for Authenticator
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'connected_user_table' => 'connected_user',

	'cookie' => [
		'access_key' => [
			'name' => 'uak',
			'expire' => 259200,		//	Login status expiration period (3 days)
			'path' => '/',
			'domain' => '',
			'secure' => false,
			'httponly' => true,

			'renew' => 172800		//	Expiration time renewal interval (2 days)
		]
	]
];
