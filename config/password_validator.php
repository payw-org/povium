<?php
/**
* Config array for PasswordValidator.
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

return [
	'len' => [
		'password_min_length' => 8,
		'password_max_length' => 50
	],

	'regex' => [
		'password_regex_base' => '/^[\w`~!@#$%\^&\*\(\)\-\+\=\{\[\]\}\|\\\;:\'\",.<>\/?]+$/',
		'password_regex_required' => '/^\S*(?=\S*[a-zA-Z])(?=\S*[0-9])\S*$/'
	],

	'msg' => [
		'password_empty' => '비밀번호를 입력해주세요.',
		'password_invalid' => '영문, 숫자, 특수문자를 조합해주세요.',
		'password_short' => '비밀번호 8자 이상 입력',
		'password_long' => '비밀번호 50자 이하로 입력',
		'password_required_condition' => '영문과 숫자 최소 하나씩 사용'
	]
];
