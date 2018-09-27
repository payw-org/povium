<?php
/**
* Config array for email validator
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'len' => [
		'email_min_length' => 3,
		'email_max_length' => 254
	],

	'msg' => [
		'email_empty' => '이메일을 입력해주세요.',
		'email_invalid' => '유효하지 않은 이메일 형식입니다.',
		'email_short' => '이메일 3자 이상 입력',
		'email_long' => '이메일 254자 이하로 입력',
		'email_is_taken' => '이미 사용중인 이메일입니다.',
	]
];
