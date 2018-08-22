<?php
/**
* Config array for authentication
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'user_table' => 'user',
	'auth_autologin_table' => 'auth_autologin',
	'auth_email_table' => 'auth_email',

	'email_auth_expire' => 60*30,	//	Email authentication expiration time

	'cookie_params' => [
		'expire' => 60*60*24*30,	//	Auto login cookie expiration time
		'path' => '/',
		'domain' => '',
		'secure' => false,
		'httponly' => false
	],
	
	'password_hash_algo' => PASSWORD_DEFAULT,
	'password_hash_options' => [
		'cost' => 13,
		'salt' => md5(openssl_random_pseudo_bytes(16))
	],

	'regex' => [
		'readable_id_regex_base' => '/^[a-z0-9_]+$/',
		'readable_id_regex_banned_1' => '/^_|_$/',
		'readable_id_regex_banned_2' => '/_{2,}/',

		'name_regex_base' => '/^[\xEA-\xED\x80-\xBF\w\s.]+$/',
		'name_regex_banned_1' => '/^[\s._]|[\s._]$/',
		'name_regex_banned_2' => '/\s{2,}|\.{2,}|_{2,}/',

		'password_regex_base' => '/^[\w`~!@#$%\^&\*\(\)\-\+\=\{\[\]\}\|\\\;:\'\",.<>\/?]+$/',
		'passowrd_regex_required' => '/^\S*(?=\S*[a-zA-Z])(?=\S*[0-9])\S*$/',
	],

	'len' => [
		'readable_id_min_length' => 3,
		'readable_id_max_length' => 20,

		'email_min_length' => 3,
		'email_max_length' => 254,

		'name_min_length' => 2,
		'name_max_length' => 30,

		'password_min_length' => 8,
		'password_max_length' => 50
	],

	'msg' => [
		'unknown_warning' => '알 수 없는 오류',
		'token_insert_to_db_err' => '자동 로그인 설정 오류',
		'user_insert_to_db_err' => '신규유저 등록 오류',

		'account_incorrect' => '계정을 다시 확인하세요.',
		'account_inactive' => '비활성화 계정입니다.',
		// 'account_invalid' => '없는 계정입니다.',

		'readable_id_istaken' => '이미 사용중인 아이디입니다.',
		'email_istaken' => '이미 사용중인 이메일입니다.',
		'name_istaken' => '이미 사용중인 이름입니다.',

		'readable_id_short' => '아이디 3자 이상 입력',
		'readable_id_long' => '아이디 20자 이하로 입력',
		'readable_id_both_ends_illegal' => '아이디의 처음과 끝에서 _ 사용불가',
		'readable_id_continuous_underscore' => '_ 연속 입력 불가',
		'readable_id_invalid' => '영문 소문자, 숫자, _ 를 조합해주세요.',

		'email_short' => '이메일 3자 이상 입력',
		'email_long' => '이메일 254자 이하로 입력',
		'email_invalid' => '유효하지 않은 이메일 형식',

		'name_short' => '이름 2자 이상 입력',
		'name_long' => '이름 30자 이하로 입력',
		'name_both_ends_illegal' => '이름의 처음과 끝에서 띄어쓰기, 특수문자 사용불가',
		'name_continuous_special_chars' => '띄어쓰기와 특수문자 연속 입력 불가',
		'name_invalid' => '한글, 영문, 숫자, . , _ , 띄어쓰기를 조합해주세요.',

		'password_short' => '비밀번호 8자 이상 입력',
		'password_long' => '비밀번호 50자 이하로 입력',
		'password_required_condition' => '영문과 숫자 최소 하나씩 사용',
		'password_invalid' => '영문, 숫자, 특수문자를 조합해주세요.'
	]
];
