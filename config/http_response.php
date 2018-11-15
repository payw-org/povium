<?php
/**
* Config array for Http response
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'401' => [
		'title' => '권한 없음',
		'heading' => '401 - 로그인이 필요한 서비스입니다.'
	],

	'403' => [
		'title' => '액세스 거부',
		'heading' => '403 – 사용 권한 없음: 액세스가 거부되었습니다.',
	],

	'404' => [
		'title' => '페이지를 찾을 수 없음',
		'heading' => '404 - 페이지를 찾을 수 없습니다.'
	],

	'405' => [
		'title' => '허용되지 않은 메소드',
		'heading' => '405 - 허용되지 않은 메소드입니다.'
	],

	'410' => [
		'title' => '만료된 페이지',
		'heading' => '410 – 만료된 페이지입니다.',
	]
];
