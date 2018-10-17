<?php
/**
* Config array for EmailActivationController.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'email_requesting_activation_table' => 'email_requesting_activation',

	'err' => [
		'not_logged_in' => [
			'code' => 0x0400,
			'msg' => '로그인이 필요한 서비스입니다.'
		],

		'user_not_found' => [
			'code' => 0x0401,
			'msg' => '인증 코드가 만료되었습니다. 인증을 다시 요청해주세요.'
		],

		'token_not_match' => [
			'code' => 0x0402,
			'msg' => '인증 실패. 토큰이 일치하지 않습니다.'
		],

		'request_expired' => [
			'code' => 0x0403,
			'msg' => '인증 코드가 만료되었습니다. 인증을 다시 요청해주세요.'
		]
	]
];
