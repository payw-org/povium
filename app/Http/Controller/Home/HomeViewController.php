<?php
/**
 * Controller for loading config of home view page.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Home;

use Povium\Http\Controller\StandardViewController;

class HomeViewController extends StandardViewController
{
	/**
	 * {@inheritdoc}
	 */
	public function loadViewConfig()
	{
		parent::loadViewConfig();

		$this->viewConfig['popular_posts'] = array(
			[
				"img" => "macbookpro2018",
				"title" => "2018년 맥북프로는 너무 뜨거워",
				"editor" => "앤소니"
			],

			[
				"img" => "spongebob",
				"title" => "내가 귀여운 이유",
				"editor" => "최홍ZUNE"
			],

			[
				"img" => "programmer",
				"title" => "프로그래머처럼 생각해야 한다",
				"editor" => "황장병치훈"
			],

			[
				"img" => "1",
				"title" => "장어덮밥을 먹을 수 없게 된다면?",
				"editor" => "박진둘"
			],

			[
				"img" => "2",
				"title" => "'동네다움'을 지킬 수 있는 방법",
				"editor" => "장준끼"
			],

			[
				"img" => "3",
				"title" => "여행하며 '현금 관리'를 잘 하는 방법",
				"editor" => "장햄"
			],

			[
				"img" => "4",
				"title" => "필름카메라의 번거러움이 좋다",
				"editor" => "청춘나지훈"
			],

			[
				"img" => "5",
				"title" => "가짜 어른 구별하는 힘을 기르는 방법",
				"editor" => "조경상병훈"
			],

			[
				"img" => "6",
				"title" => "사진을 시작한 사람들이 앓는다는 '장비병'",
				"editor" => "쿠형"
			]
		);

		return $this->viewConfig;
	}
}
