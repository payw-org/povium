<?php
/**
 * Controller for publishing post.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 Povium
 */

namespace Readigm\Http\Controller\Post;

use Readigm\Http\Controller\Exception\InvalidAccessException;
use Readigm\Http\Controller\Exception\PostNotFoundException;
use Readigm\Publication\Post\AutoSavedPostManager;
use Readigm\Publication\Post\PostManager;
use Readigm\Security\User\User;

class PostPublicationController
{
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
	 * @var array
	 */
	private $config;

	/**
	 * @param \PDO 							$conn
	 * @param PostFormValidationController 	$post_form_validation_controller
	 * @param AutoSavedPostManager 			$auto_saved_post_manager
	 * @param PostManager 					$post_manager
	 * @param array 						$config
	 */
	public function __construct(
		\PDO $conn,
		PostFormValidationController $post_form_validation_controller,
		AutoSavedPostManager $auto_saved_post_manager,
		PostManager $post_manager,
		array $config
	) {
		$this->conn = $conn;
		$this->postFormValidationController = $post_form_validation_controller;
		$this->autoSavedPostManager = $auto_saved_post_manager;
		$this->postManager = $post_manager;
		$this->config = $config;
	}

	/**
	 * Validate post fields and create an post record.
	 * And delete the auto saved record for temp post.
	 *
	 * @param int 			$auto_saved_post_id
	 * @param User 			$user				User who requested
	 * @param int			$authority			Authority level of user
	 * @param string 		$title
	 * @param string 		$body
	 * @param string 		$contents
	 * @param bool 			$is_premium
	 * @param int|null 		$series_id
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 *
	 * @return array	Error flag, message and published post id
	 *
	 * @throws PostNotFoundException	If the temp post is not found
	 * @throws InvalidAccessException	If the requested user isn't the editor of the temp post
	 */
	public function publish(
		$auto_saved_post_id,
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
			'msg' => '',
			'id' => null
		);

		$auto_saved_post = $this->autoSavedPostManager->getAutoSavedPost($auto_saved_post_id);

		if ($auto_saved_post === false) {
			throw new PostNotFoundException($this->config['msg']['auto_saved_post_not_found']);
		}

		if ($user->getID() != $auto_saved_post->getUserID()) {
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
