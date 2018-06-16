<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/class/view/TemplateEngine.php';

$te = new TemplateEngine();
$te->render("/template/base.phtml", [
	"title" => "Povium | 좋은 글, 세상을 바꾸는 힘",
	"css" => '<link rel="stylesheet" href="css/home.css">',
	"main" => "template/home.phtml",
	"script" => '<script src="js/home.js"></script>',

	"post_img_link" => [
		"programmer", "1", "2" , "3", "4", "5", "6"
	],
	"post_title" => [
		"프로그래밍을 해야 하는 이유",
		"장어덮밥을 먹을 수 없게 된다면?<br>그럼 불고기 덮밥을 먹으면 되지!",
		"'동네다움'을 지킬 수 있는 방법",
		"여행하며 '현금 관리'를 잘 하는 방법",
		"필름카메라의 번거러움이 좋다",
		"가짜 어른 구별하는 힘을 기르는 방법",
		"사진을 시작한 사람들이 앓는다는 '장비병'"
	],
	"post_writer" => [
		"황장병치훈", "박진둘", "장준끼", "장햄", "청춘나지훈", "조경상병훈", "쿠형"
	]
]);

?>
