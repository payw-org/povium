<?php
use Povium\Base\TemplateEngine;

$te = new TemplateEngine();
$te->render("/resources/templates/base.phtml", [
	"title" => "Povium | 좋은 글, 세상을 바꾸는 힘",
	"main" => "/resources/templates/home.phtml",

	"post_img_link" => [
		"spongebob", "programmer", "1", "2" , "3", "4", "5", "6"
	],
	"post_title" => [
		"내가 귀여운 이유",
		"프로그래머처럼 생각해야 한다",
		"장어덮밥을 먹을 수 없게 된다면?",
		"'동네다움'을 지킬 수 있는 방법",
		"여행하며 '현금 관리'를 잘 하는 방법",
		"필름카메라의 번거러움이 좋다",
		"가짜 어른 구별하는 힘을 기르는 방법",
		"사진을 시작한 사람들이 앓는다는 '장비병'"
	],
	"post_writer" => [
		"최홍ZUNE", "황장병치훈", "박진둘", "장준끼", "장햄", "청춘나지훈", "조경상병훈", "쿠형"
	]
]);
