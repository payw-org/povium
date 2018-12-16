<?php
/**
 * Controller for creating temp post.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Post;

use Povium\Publication\Post\AutoSavedPostManager;
use Povium\Security\User\User;

class TempPostCreationController
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var PostFormValidationController
	 */
	protected $postFormValidationController;

	/**
	 * @var AutoSavedPostManager
	 */
	protected $autoSavedPostManager;

	/**
	 * @param array 						$config
	 * @param PostFormValidationController 	$post_form_validation_controller
	 * @param AutoSavedPostManager 			$auto_saved_post_manager
	 */
	public function __construct(
		array $config,
		PostFormValidationController $post_form_validation_controller,
		AutoSavedPostManager $auto_saved_post_manager
	) {
		$this->config = $config;
		$this->postFormValidationController = $post_form_validation_controller;
		$this->autoSavedPostManager = $auto_saved_post_manager;
	}

	/**
	 * Validate post fields.
	 * And create an auto saved record for temp post.
	 *
	 * @param  User			$user		User who requested
	 * @param  string  		$title
	 * @param  string  		$body
	 * @param  string  		$contents
	 * @param  bool 		$is_premium
	 * @param  int|null		$series_id
	 * @param  string|null	$subtitle
	 * @param  string|null  $thumbnail
	 *
	 * @return array 	Error flag, message and auto saved record id
	 */
	public function create(
		$user,
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
			'msg' => '',
			'id' => null
		);

		/* Validation check for fields */

		if (!$this->postFormValidationController->isValid(
			$user,
			$title,
			$body,
			$contents,
			$is_premium,
			$series_id,
			$subtitle,
			$thumbnail,
			true
		)) {
			$return['msg'] = $this->config['msg']['incorrect_form'];

			return $return;
		}

		/* Create */

		if (!$this->autoSavedPostManager->addRecord(
			$user->getID(),
			$title,
			$body,
			$contents,
			$is_premium,
			null,
			$series_id,
			$subtitle,
			$thumbnail
		)) {
			$return['msg'] = $this->config['msg']['save_err'];

			return $return;
		}

		//	Successfully created
		$return['err'] = false;
		$return['id'] = $this->autoSavedPostManager->getLastInsertID();

		return $return;
	}
}
