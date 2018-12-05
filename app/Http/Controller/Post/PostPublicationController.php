<?php
/**
 * Controller for publishing post.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Post;

use Povium\Http\Controller\Exception\InvalidAccessException;
use Povium\Http\Controller\Exception\PostNotFoundException;
use Povium\Publication\Post\AutoSavedPostManager;
use Povium\Publication\Post\PostManager;
use Povium\Security\User\User;

class PostPublicationController
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * Database connection (PDO)
	 *
	 * @var \PDO
	 */
	protected $conn;

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
	 * @param array 						$config
	 * @param \PDO 							$conn
	 * @param PostFormValidationController 	$post_form_validation_controller
	 * @param AutoSavedPostManager 			$auto_saved_post_manager
	 * @param PostManager 					$post_manager
	 */
	public function __construct(
		array $config,
		\PDO $conn,
		PostFormValidationController $post_form_validation_controller,
		AutoSavedPostManager $auto_saved_post_manager,
		PostManager $post_manager
	) {
		$this->config = $config;
		$this->conn = $conn;
		$this->postFormValidationController = $post_form_validation_controller;
		$this->autoSavedPostManager = $auto_saved_post_manager;
		$this->postManager = $post_manager;
	}

	/**
	 * Validate post fields and create an post record.
	 * And delete the auto saved post record which is already published.
	 *
	 * @param int 			$auto_saved_post_id	ID of the temp post to publish
	 * @param User 			$user				User who requested
	 * @param string 		$title
	 * @param string 		$body
	 * @param string 		$contents			Json string
	 * @param bool 			$is_premium
	 * @param int|null 		$series_id
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 *
	 * @return array	Error flag, message and id of the published post
	 *
	 * @throws PostNotFoundException	If temp post to publish is not found
	 * @throws InvalidAccessException	If the requested user isn't the editor of the temp post
	 */
	public function publish(
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
			'msg' => '',
			'id' => null
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
			$thumbnail
		)) {
			$return['msg'] = $this->config['msg']['incorrect_form'];

			return $return;
		}

		/* Publish */

		try {
			$this->conn->beginTransaction();

			$this->postManager->addRecord(
				$user->getID(),
				$title,
				$body,
				$contents,
				$is_premium,
				$series_id,
				$subtitle,
				$thumbnail
			);
			$published_post_id = $this->postManager->getLastInsertID();

			$this->autoSavedPostManager->deleteRecord($auto_saved_post_id);

			$this->conn->commit();
		} catch (\PDOException $e) {
			$this->conn->rollBack();

			$return['msg'] = $this->config['msg']['publication_err'];

			return $return;
		}

		//	Successfully published
		$return['err'] = false;
		$return['id'] = $published_post_id;

		return $return;
	}
}
