<?php
/**
* Config array for readable id validator
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

return [
	'len' => [
		'readable_id_min_length' => 3,
		'readable_id_max_length' => 20
	],

	'regex' => [
		'readable_id_regex_base' => '/^[a-z0-9_]+$/',
		'readable_id_regex_banned_1' => '/^_|_$/',
		'readable_id_regex_banned_2' => '/_{2,}/'
	],

	'msg' => [
		'readable_id_empty' => '아이디를 입력해주세요.',
		'readable_id_invalid' => '영문 소문자, 숫자, _ 를 조합해주세요.',
		'readable_id_short' => '아이디 3자 이상 입력',
		'readable_id_long' => '아이디 20자 이하로 입력',
		'readable_id_both_ends_illegal' => '아이디의 처음과 끝에서 _ 사용불가',
		'readable_id_continuous_underscore' => '_ 연속 입력 불가',
		'readable_id_is_taken' => '이미 사용중인 아이디입니다.'
	]
];
