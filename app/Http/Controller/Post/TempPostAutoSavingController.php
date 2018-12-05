<?php
/**
 * Controller for auto saving temp post.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Post;

use Povium\Http\Controller\Exception\InvalidAccessException;
use Povium\Http\Controller\Exception\PostNotFoundException;
use Povium\Publication\Post\AutoSavedPostManager;
use Povium\Security\User\User;

class TempPostAutoSavingController
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
	 * Validate and update the auto saved post record.
	 *
	 * @param  int  		$auto_saved_post_id	ID of the temp post to auto save
	 * @param  User			$user				User who requested
	 * @param  string  		$title
	 * @param  string  		$body
	 * @param  string  		$contents			Json string
	 * @param  bool 		$is_premium
	 * @param  int|null  	$series_id
	 * @param  string|null	$subtitle
	 * @param  string|null	$thumbnail
	 *
	 * @return array 	Error flag and message
	 *
	 * @throws PostNotFoundException	If temp post to auto save is not found
	 * @throws InvalidAccessException	If the requested user isn't the editor of the temp post
	 */
	public function autoSave(
		$auto_saved_post_id,
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
			'msg' => ''
		);

		$auto_saved_post = $this->autoSavedPostManager->getAutoSavedPost($auto_saved_post_id);

		//	If the auto saved post is not found
		if ($auto_saved_post === false) {
			throw new PostNotFoundException($this->config['msg']['auto_saved_post_not_found']);
		}

		//	If the user isn't the editor of the auto saved post
		if ($user->getID() != $auto_saved_post->getUserID()) {
			throw new InvalidAccessException($this->config['msg']['invalid_access']);
		}

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

		/* Auto save */

		$params = array(
			'title' => $title,
			'body' => $body,
			'contents' => $contents,
			'is_premium' => $is_premium,
			'last_edited_dt' => date('Y-m-d H:i:s'),
			'series_id' => $series_id,
			'subtitle' => $subtitle,
			'thumbnail' => $thumbnail
		);

		if (!$this->autoSavedPostManager->updateRecord($auto_saved_post_id, $params)) {
			$return['msg'] = $this->config['msg']['auto_save_err'];

			return $return;
		}

		//	Successfully auto saved
		$return['err'] = false;

		return $return;
	}
}
