<?php
/**
 * Manage temp post edit.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Publication\Controller\Post;

use Povium\Security\User\User;

class TempPostEditController
{
	/**
	 * @var array
	 */
	protected $config;

	public function __construct()
	{

	}

	/**
	 * Validate components to update.
	 * Then edit the temp post record.
	 *
	 * @param  User			$user				User who edited the temp post
	 * @param  int  		$autosaved_post_id  ID of the autosaved post to edit
	 * @param  string  		$title
	 * @param  string  		$body
	 * @param  string  		$contents			Json string
	 * @param  bool 		$is_premium
	 * @param  int|null  	$series_id
	 * @param  string|null	$subtitle
	 * @param  string|null	$thumbnail
	 *
	 * @return array 	Error flag and message
	 */
	public function editTempPost(
		$user,
		$autosaved_post_id,
		$title,
		$body,
		$contents,
		$is_premium,
		$series_id = null,
		$subtitle = null,
		$thumbnail = null
	) {
		$return = array(
			'err' => true,
			'msg' => ''
		);

		//	If user is not verified
		if (!$user->isVerified()) {
			$return['msg'] = $this->config['msg']['is_not_verified_user'];

			return $return;
		}

		
	}
}
