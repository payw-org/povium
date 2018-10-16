<?php
/**
 * Manage post edit.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Publication\Controller\Post;

use Povium\Publication\Validator\PostInfo\TitleValidator;
use Povium\Publication\Validator\PostInfo\ContentsValidator;
use Povium\Publication\Validator\PostInfo\ThumbnailValidator;
use Povium\Publication\Validator\PostInfo\SubtitleValidator;
use Povium\Publication\Post\PostManager;
use Povium\Security\Auth\Auth;

class PostEditController
{
	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @var TitleValidator
	 */
	protected $titleValidator;

	/**
	 * @var ContentsValidator
	 */
	protected $contentsValidator;

	/**
	 * @var ThumbnailValidator
	 */
	protected $thumbnailValidator;

	/**
	 * @var SubtitleValidator
	 */
	protected $subtitleValidator;

	/**
	 * @var PostManager
	 */
	protected $postManager;

	/**
	 * @var Auth
	 */
	protected $auth;

	public function __construct()
	{

	}

	/**
	 * Check and validate components to update.
	 * Then edit the post.
	 *
	 * @param  string  		$post_id	ID of the post to edit
	 * @param  string  		$title
	 * @param  string  		$contents   Json string
	 * @param  bool			$is_premium
	 * @param  int|null		$series_id
	 * @param  string|null	$thumbnail
	 * @param  string|null	$subtitle
	 *
	 * @return
	 */
	public function editPost(
		$post_id,
 		$title,
 		$contents,
 		$is_premium,
 		$series_id = null,
 		$thumbnail = null,
 		$subtitle = null
	) {
		$return = array(
			'err' => true,
			'msg' => ''
		);

		/* Validate post edit request */

		$current_user = $this->auth->getCurrentUser();

		//	Not logged in
		if ($current_user === false) {
			$return['msg'] = $this->config['msg']['not_logged_in'];

			return $return;
		}

		$post = $this->postManager->getPost($post_id);

		//	Nonexistent or already deleted post
		if ($post === false || $post->isDeleted()) {
			$return['msg'] = $this->config['msg']['post_id_invalid'];

			return $return;
		}

		//	Current user is not the writer of the post
		if ($current_user->getID() != $post->getUserID()) {
			$return['msg'] = $this->config['msg']['post_id_invalid'];

			return $return;
		}

		/* Check and validate components to update */

		$components_to_update = array();

		//	Title is changed
		if ($title != $post->getTitle()) {
			$validate_title = $this->titleValidator->validate($title);

			//	Invalid title
			if ($validate_title['err']) {
				$return['msg'] = $validate_title['msg'];

				return $return;
			}

			$components_to_update['title'] = $title;
		}

		//	Contents is changed
		if ($contents != $post->getContents()) {
			$validate_contents = $this->contentsValidator->validate($contents);

			//	Invalid contents
			if ($validate_contents['err']) {
				$return['msg'] = $validate_contents['msg'];

				return $return;
			}

			$components_to_update['contents'] = $contents;
		}

		//	Thumbnail is changed
		if ($thumbnail != $post->getThumbnail()) {
			//	Thumbnail is set
			if ($thumbnail !== null) {
				$validate_thumbnail = $this->thumbnailValidator->validate($thumbnail);

				//	Invalid thumbnail
				if ($validate_thumbnail['err']) {
					$return['msg'] = $validate_thumbnail['msg'];

					return $return;
				}
			}

			$components_to_update['thumbnail'] = $thumbnail;
		}

		//	Subtitle is changed
		if ($subtitle != $post->getSubtitle()) {
			//	Subtitle is set
			if ($subtitle !== null) {
				$validate_subtitle = $this->subtitleValidator->validate($subtitle);

				//	Invalid subtitle
				if ($validate_subtitle['err']) {
					$return['msg'] = $validate_subtitle['msg'];

					return $return;
				}
			}

			$components_to_update['subtitle'] = $subtitle;
		}

		//	Premium setting is changed
		if ($is_premium != $post->isPremium()) {
			//	If want to publish as premium
			if ($is_premium) {
				// @TODO	Check if the current user is possible to publish premium post
			}

			$components_to_update['is_premium'] = $is_premium;
		}

		//	Series setting is changed
		if ($series_id != $post->getSeriesID()) {
			//	Series is set
			if ($series_id !== null) {
				// @TODO	Check if the current user's series
			}

			$components_to_update['series_id'] = $series_id;
		}

		/* Edit processing */

		$components_to_update['last_edited_dt'] = date('Y-m-d H:i:s');

		//	If failed to update post record
		if (!$this->postManager->updatePost($post_id, $components_to_update)) {
			$return['msg'] = $this->config['msg']['post_edit_err'];

			return $return;
		}

		//	Successfully edited
		$return['err'] = false;

		return $return;
	}
}
