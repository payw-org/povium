<?php
header('Content-type: text/plain; charset=utf-8');

/**
* [return description]
* @var array	config array for authentication
*/
return [
	//	regular expressions

	'table_users' => 'user_info',
	'table_tokens' => 'token_info',

	'cookie_params' => [
		'expire' => 60*60*24*30,
		'path' => '/',
		'domain' => '.povium.com',
		'secure' => false,
		'httponly' => false
	],

	'pw_hash_options' => [
		'cost' => 13,
		'salt' => md5(openssl_random_pseudo_bytes(16)),
	],


	'regexp' => [
		'userid_regexp' => '/^[a-z0-9-]{3,40}$/',
		'userpw_regexp' => '/^\S*(?=\S{8,50})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])\S*$/'
	],


	'len' => [
		'userid_min_length' => 3,
		'userid_max_length' => 40,

		'userpw_min_length' => 8,
		'userpw_max_length' => 50
	],


	//	message
	'msg' => [
		'system_warning' => '알 수 없는 오류입니다.',

		'account_incorrect' => '아이디 또는 비밀번호를 다시 확인하세요.',
		'account_inactive' => '비활성화 계정입니다.',
		// 'account_invalid' => '없는 계정입니다.',

		'userid_short' => '3자 이상으로 입력해주세요.',
		'userid_long' => '40자 이하로 입력해주세요.',
		'userid_invalid' => '3~40자 영문 소문자, 숫자와 하이픈을 사용할 수 있습니다.',

		'userpw_short' => '8자 이상으로 입력해주세요.',
		'userpw_long' => '50자 이하로 입력해주세요.',
		'userpw_invalid' => '8~50자 영문 대 소문자, 숫자를 최소 하나씩 사용해주세요.'
	]
];


?>
