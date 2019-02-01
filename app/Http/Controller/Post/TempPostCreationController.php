<?php
/**
 * Controller for creating temp post.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

namespace Readigm\Http\Controller\Post;

use Readigm\Publication\Post\AutoSavedPostManager;
use Readigm\Security\User\User;

class TempPostCreationController
{
	/**
	 * @var PostFormValidationController
	 */
	protected $postFormValidationController;

	/**
	 * @var AutoSavedPostManager
	 */
	protected $autoSavedPostManager;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param PostFormValidationController 	$post_form_validation_controller
	 * @param AutoSavedPostManager 			$auto_saved_post_manager
	 * @param array 						$config
	 */
	public function __construct(
		PostFormValidationController $post_form_validation_controller,
		AutoSavedPostManager $auto_saved_post_manager,
		array $config
	) {
		$this->postFormValidationController = $post_form_validation_controller;
		$this->autoSavedPostManager = $auto_saved_post_manager;
		$this->config = $config;
	}

	/**
	 * Validate post fields.
	 * And create an auto saved record for temp post.
	 *
	 * @param  User			$user		User who requested
	 * @param  int			$authority	Authority level of user
	 * @param  string  		$contents
	 * @param  bool 		$is_premium
	 * @param  int|null		$series_id
	 *
	 * @return array 	Error flag, message and auto saved record id
	 */
	public function create(
		$user,
		$authority,
		$contents,
		$is_premium,
		$series_id = null
	) {
		$return = array(
			'err' => true,
			'msg' => '',
			'id' => null
		);

		/* Validation check for fields */
		//
		// if (!$this->postFormValidationController->isValid(
		// 	$user,
		// 	$authority,
		// 	$title,
		// 	$body,
		// 	$contents,
		// 	$is_premium,
		// 	$series_id,
		// 	$subtitle,
		// 	$thumbnail,
		// 	true
		// )) {
		// 	$return['msg'] = $this->config['msg']['incorrect_form'];
		//
		// 	return $return;
		// }
		//
		// /* Create */
		//
		// if (!$this->autoSavedPostManager->addRecord(
		// 	$user->getID(),
		// 	$title,
		// 	$body,
		// 	$contents,
		// 	$is_premium,
		// 	null,
		// 	$series_id,
		// 	$subtitle,
		// 	$thumbnail
		// )) {
		// 	$return['msg'] = $this->config['msg']['save_err'];
		//
		// 	return $return;
		// }

		//	Successfully created
		$return['err'] = false;
		$return['id'] = $this->autoSavedPostManager->getLastInsertID();

		return $return;
	}
}
