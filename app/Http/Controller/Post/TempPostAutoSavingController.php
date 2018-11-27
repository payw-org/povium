<?php
/**
 * Controller for auto saving temp post.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Post;

use Povium\Publication\Post\AutoSavedPostManager;
use Povium\Security\User\User;

class TempPostAutoSavingController
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var AutoSavedPostManager
	 */
	protected $autoSavedPostManager;

	public function __construct()
	{

	}

	/**
	 * Validate and update the auto saved post record.
	 *
	 * @param  User			$user				User who requested
	 * @param  int  		$auto_saved_post_id	ID of the temp post to auto save
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
	public function autoSave(
		$user,
		$auto_saved_post_id,
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
			'code' => 0,
			'msg' => ''
		);

		/* Check if requesting user is matched with editor */

		$auto_saved_post = $this->autoSavedPostManager->getAutoSavedPost($auto_saved_post_id);

		if ($auto_saved_post === false) {
			$return['msg'] = $this->config['msg']['nonexistent_temp_post'];

			return $return;
		}

		if ($user->getID() != $auto_saved_post->getUserID()) {
			$return['msg'] = $this->config['msg'][''];

			return $return;
		}

		/* Validation check for fields of post form */


	}
}
