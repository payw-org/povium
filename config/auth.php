<?php
/**
* config array for authentication
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

return [
	'table__users' => 'users',
	'table__auto_login_auth' => 'auto_login_auth',


	'cookie_params' => [
		'expire' => 60*60*24*30,
		'path' => '/',
		'domain' => '',
		'secure' => false,
		'httponly' => false
	],


	'pw_hash_options' => [
		'cost' => 13,
		'salt' => md5(openssl_random_pseudo_bytes(16))
	],


	'regex' => [
		'readable_id_regex_base' => '/^[a-z0-9_]{3,20}$/',
		'readable_id_regex_banned_1' => '/^_|_$/',
		'readable_id_regex_banned_2' => '/_{2,}/',

		'name_regex_base' => '/^[\xEA-\xED\x80-\xBF\w\s.]{2,30}$/',
		'name_regex_banned_1' => '/^[\s._]|[\s._]$/',
		'name_regex_banned_2' => '/\s{2,}|\.{2,}|_{2,}/',

		'password_regex' => '/^\S*(?=\S{8,50})(?=\S*[a-z])(?=\S*[0-9])\S*$/'
	],


	'len' => [
		'readable_id_min_length' => 3,
		'readable_id_max_length' => 20,

		'email_min_length' => 6,
		'email_max_length' => 50,

		'name_min_length' => 2,
		'name_max_length' => 30,

		'password_min_length' => 8,
		'password_max_length' => 50
	],


	//	message
	'msg' => [
		'unknown_warning' => '알 수 없는 오류입니다.',
		'token_insert_to_db_err' => '자동 로그인 설정 오류',
		'user_insert_to_db_err' => '신규유저 등록 오류',

		'account_incorrect' => '계정을 다시 확인하세요.',
		'account_inactive' => '비활성화 계정입니다.',
		// 'account_invalid' => '없는 계정입니다.',

		'readable_id_istaken' => '이미 사용중인 아이디입니다.',
		'email_istaken' => '이미 사용중인 이메일입니다.',
		'name_istaken' => '이미 사용중인 이름입니다.',

		'readable_id_short' => '아이디를 3자 이상 입력해주세요.',
		'readable_id_long' => '아이디를 20자 이하로 입력해주세요.',
		'readable_id_both_ends_illegal' => '아이디의 처음 또는 끝에서 _를 사용할 수 없습니다.',
		'readable_id_continuous_underscore' => '_는 연속으로 사용할 수 없습니다.',
		'readable_id_invalid' => '영어 소문자, 숫자, _를 조합해 입력해주세요.',

		'email_short' => '이메일을 6자 이상 입력해주세요.',
		'email_long' => '이메일을 50자 이하로 입력해주세요.',
		'email_invalid' => '유효하지 않은 이메일 형식 입니다.',

		'name_short' => '이름을 2자 이상 입력해주세요.',
		'name_long' => '이름을 30자 이하로 입력해주세요.',
		'name_both_ends_illegal' => '이름의 처음 또는 끝에서 띄어쓰기나 특수문자를 사용할 수 없습니다.',
		'name_continuous_special_chars' => '띄어쓰기와 특수문자는 연속으로 사용할 수 없습니다.',
		'name_invalid' => '한글, 영어 대소문자, 숫자, . , _ , 띄어쓰기를 조합해 입력해주세요.',

		'password_short' => '비밀번호를 8자 이상 입력해주세요.',
		'password_long' => '비밀번호를 50자 이하로 입력해주세요.',
		'password_invalid' => '8~50자 영어 소문자, 숫자를 최소 하나씩 사용해주세요.'
	]

];
