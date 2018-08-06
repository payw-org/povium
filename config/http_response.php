<?php
/**
* Config array for Http response
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'403' => [
		'title' => '액세스 거부',
		'msg' => '403 – 사용 권한 없음: 액세스가 거부되었습니다.',
		'details' => [
			'not_matched_token' => '인증 실패. 토큰이 일치하지 않습니다.'
		]
	],

	'404' => [
		'title' => '페이지를 찾을 수 없음',
		'msg' => '404 - 페이지를 찾을 수 없습니다.'
	],

	'405' => [
		'title' => '허용되지 않은 메소드',
		'msg' => '405 - 허용되지 않은 메소드입니다.'
	],

	'410' => [
		'title' => '만료된 페이지',
		'msg' => '410 – 만료된 페이지입니다.',
		'details' => [
			'nonexistent_user_id' => '인증 코드가 만료되었습니다. 인증을 다시 요청해주세요.',
			'request_expired' => '인증 코드가 만료되었습니다. 인증을 다시 요청해주세요.'
		]
	],
];