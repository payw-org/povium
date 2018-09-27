<?php
/**
* Config array for email activation controller
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'email_waiting_for_activation_table' => 'email_waiting_for_activation',

	'email_activation_expire' => 1800,	//	Email activation expiration term (30 minutes)

	'msg' => [
		'not_logged_in' => '로그인 후 이용해주세요.',
		'activation_email_err' => '인증 이메일을 보내는 과정에서 에러가 발생했습니다.'
	],

	'code' => [
		'not_logged_in' => 0x0400,
		'user_not_found' => 0x0401,
		'token_not_match' => 0x0402,
		'request_expired' => 0x0403
	]
];
