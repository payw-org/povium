<?php
/**
* Config array for EmailActivationController.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'email_requesting_activation_table' => 'email_requesting_activation',

	'msg' => [
		'user_not_found' => '인증 코드가 만료되었습니다. 인증을 다시 요청해주세요.',
		'token_not_match' => '인증 실패. 토큰이 일치하지 않습니다.',
		'request_expired' => '인증 코드가 만료되었습니다. 인증을 다시 요청해주세요.'
	]
];
