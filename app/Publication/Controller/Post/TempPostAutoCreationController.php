<?php
/**
 * Manage temp post auto creation.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Publication\Controller\Post;

class TempPostAutoCreationController
{
	/**
	 * @var array
	 */
	protected $config;

	public function __construct()
	{

	}

	public function autoCreateTempPost(
		$user,
		$title,
		$contents,
		$is_premium,
		$series_id = null,
		$thumbnail = null,
 		$subtitle = null
	) {
		
	}
}

// https://medium.com/new-story
// https://medium.com/p/47a911dbb8a7/edit
// https://medium.com/p/b2fc5917d4b4/edit
//
// https://povium.com/new-post
//
// https://povium.com/post/{post id}/edit
//
// https://povium.com/temp-post/{temp post id}/edit
