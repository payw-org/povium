<?php
/**
* Config array for name validator
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

return [
	'len' => [
		'name_min_length' => 2,
		'name_max_length' => 30
	],

	'regex' => [
		'name_regex_base' => '/^[\xEA-\xED\x80-\xBF\w\s.]+$/',
		'name_regex_banned_1' => '/^[\s._]|[\s._]$/',
		'name_regex_banned_2' => '/\s{2,}|\.{2,}|_{2,}/'
	],

	'msg' => [
		'name_empty' => '이름을 입력해주세요.',
		'name_invalid' => '한글, 영문, 숫자, . , _ , 띄어쓰기를 조합해주세요.',
		'name_short' => '이름 2자 이상 입력',
		'name_long' => '이름 30자 이하로 입력',
		'name_both_ends_illegal' => '이름의 처음과 끝에서 띄어쓰기, 특수문자 사용불가',
		'name_continuous_special_chars' => '띄어쓰기와 특수문자 연속 입력 불가',
		'name_is_taken' => '이미 사용중인 이름입니다.'
	]
];
