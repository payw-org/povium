<?php
/**
 * Controller for auto saving post.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

namespace Povium\Http\Controller\Post;

use Povium\Http\Controller\Exception\InvalidAccessException;
use Povium\Http\Controller\Exception\PostNotFoundException;
use Povium\Publication\Post\AutoSavedPostManager;
use Povium\Publication\Post\PostManager;
use Povium\Security\User\User;

class PostAutoSavingController
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
	 * @var PostManager
	 */
	protected $postManager;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param PostFormValidationController 	$post_form_validation_controller
	 * @param AutoSavedPostManager 			$auto_saved_post_manager
	 * @param PostManager 					$post_manager
	 * @param array 						$config
	 */
	public function __construct(
		PostFormValidationController $post_form_validation_controller,
		AutoSavedPostManager $auto_saved_post_manager,
		PostManager $post_manager,
		array $config
	) {
		$this->postFormValidationController = $post_form_validation_controller;
		$this->autoSavedPostManager = $auto_saved_post_manager;
		$this->postManager = $post_manager;
		$this->config = $config;
	}

	/**
	 * Validate post fields.
	 * And create/update the auto saved record for post.
	 *
	 * @param int 			$post_id
	 * @param User 			$user		User who requested
	 * @param int			$authority	Authority level of user
	 * @param string 		$title
	 * @param string 		$body
	 * @param string 		$contents
	 * @param bool 			$is_premium
	 * @param int|null 		$series_id
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 *
	 * @return array	Error flag and message
	 *
	 * @throws PostNotFoundException	If the post is not found
	 * @throws InvalidAccessException	If the requested user isn't the editor of the post
	 */
	public function autoSave(
		$post_id,
		$user,
		$authority,
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

		$post = $this->postManager->getPost($post_id);

		if ($post === false) {
			throw new PostNotFoundException($this->config['msg']['post_not_found']);
		}

		if ($user->getID() != $post->getUserID()) {
			throw new InvalidAccessException($this->config['msg']['invalid_access']);
		}

		/* Validation check for fields */

		if (!$this->postFormValidationController->isValid(
			$user,
			$authority,
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

		$auto_saved_post = $this->autoSavedPostManager->getAutoSavedPostFromPostID($post_id);

		if ($auto_saved_post === false) {	//	If first auto save
			if (!$this->autoSavedPostManager->addRecord(
				$user->getID(),
				$title,
				$body,
				$contents,
				$is_premium,
				$post_id,
				$series_id,
				$subtitle,
				$thumbnail
			)) {
				$return['msg'] = $this->config['msg']['auto_save_err'];

				return $return;
			}
		} else {
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

			if (!$this->autoSavedPostManager->updateRecord($auto_saved_post->getID(), $params)) {
				$return['msg'] = $this->config['msg']['auto_save_err'];

				return $return;
			}
		}

		//	Successfully auto saved
		$return['err'] = false;

		return $return;
	}
}
