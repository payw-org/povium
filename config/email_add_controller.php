<?php
/**
* Config array for EmailAddController.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'email_requesting_activation_table' => 'email_requesting_activation',

	'email_activation_expire' => 1800,	//	Email activation expiration term (30 minutes)

	'msg' => [
		'activation_email_err' => '인증 이메일을 보내는 과정에서 에러가 발생했습니다.'
	]
];
