<?php
/**
* Config array for EmailAddController.
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

return [
	'email_requesting_activation_table' => 'email_requesting_activation',

	'email_activation_expire' => 1800,	//	Email activation expiration term (30 minutes)

	'msg' => [
		'add_record_err' => '요청이 실패했습니다. 다시 시도해주세요.'
	]
];
