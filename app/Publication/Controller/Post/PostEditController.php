<?php
/**
 * Manage post edit.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Publication\Controller\Post;

use Povium\Publication\Validator\PostInfo\TitleValidator;
use Povium\Publication\Validator\PostInfo\BodyValidator;
use Povium\Publication\Validator\PostInfo\ContentsValidator;
use Povium\Publication\Validator\PostInfo\SubtitleValidator;
use Povium\Publication\Validator\PostInfo\ThumbnailValidator;
use Povium\Publication\Post\PostManager;
use Povium\Security\User\User;

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
	 * @var BodyValidator
	 */
	protected $bodyValidator;

	/**
	 * @var ContentsValidator
	 */
	protected $contentsValidator;

	/**
	 * @var SubtitleValidator
	 */
	protected $subtitleValidator;

	/**
	 * @var ThumbnailValidator
	 */
	protected $thumbnailValidator;

	/**
	 * @var PostManager
	 */
	protected $postManager;

	public function __construct()
	{

	}

	/**
	 * Validate components to update.
	 * Then edit the post record.
	 *
	 * @param  User			$user		User who edited the post
	 * @param  int  		$post_id	ID of the post to edit
	 * @param  string  		$title
	 * @param  string		$body
	 * @param  string  		$contents   Json string
	 * @param  bool			$is_premium
	 * @param  int|null		$series_id
	 * @param  string|null	$subtitle
	 * @param  string|null	$thumbnail
	 *
	 * @return array 	Error flag and message
	 */
	public function editPost(
		$user,
		$post_id,
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

		/* Validate post edit request */

		$post = $this->postManager->getPost($post_id);

		//	Nonexistent post
		if ($post === false) {
			$return['msg'] = $this->config['msg']['post_id_invalid'];

			return $return;
		}

		//	User is not the writer of the post
		if ($user->getID() != $post->getUserID()) {
			$return['msg'] = $this->config['msg']['post_id_invalid'];

			return $return;
		}

		/* Check and validate components to update */

		$components_to_update = array();

		$validate_title = $this->titleValidator->validate($title);

		//	If invalid title
		if ($validate_title['err']) {
			$return['msg'] = $validate_title['msg'];

			return $return;
		}

		$components_to_update['title'] = $title;

		$validate_body = $this->bodyValidator->validate($body);

		//	If invalid body
		if ($validate_body['err']) {
			$return['msg'] = $validate_body['msg'];

			return $return;
		}

		$components_to_update['body'] = $body;

		$validate_contents = $this->contentsValidator->validate($contents);

		//	If invalid contents
		if ($validate_contents['err']) {
			$return['msg'] = $validate_contents['msg'];

			return $return;
		}

		$components_to_update['contents'] = $contents;

		//	Subtitle is set
		if ($subtitle !== null) {
			$validate_subtitle = $this->subtitleValidator->validate($subtitle);

			//	If invalid subtitle
			if ($validate_subtitle['err']) {
				$return['msg'] = $validate_subtitle['msg'];

				return $return;
			}
		}

		$components_to_update['subtitle'] = $subtitle;

		//	Thumbnail is changed
		if ($thumbnail != $post->getThumbnail()) {
			//	Thumbnail is set
			if ($thumbnail !== null) {
				$validate_thumbnail = $this->thumbnailValidator->validate($thumbnail);

				//	If invalid thumbnail
				if ($validate_thumbnail['err']) {
					$return['msg'] = $validate_thumbnail['msg'];

					return $return;
				}
			}

			$components_to_update['thumbnail'] = $thumbnail;
		}

		//	Premium setting is changed
		if ($is_premium != $post->isPremium()) {
			//	If want to publish as premium
			if ($is_premium) {
				// @TODO	Check if the user is possible to publish premium post
			}

			$components_to_update['is_premium'] = $is_premium;
		}

		//	Series setting is changed
		if ($series_id != $post->getSeriesID()) {
			//	Series is set
			if ($series_id !== null) {
				// @TODO	Check if the user's series
			}

			$components_to_update['series_id'] = $series_id;
		}

		/* Edit processing */

		$components_to_update['last_edited_dt'] = date('Y-m-d H:i:s');

		//	If failed to update post record
		if (!$this->postManager->updateRecord($post_id, $components_to_update)) {
			$return['msg'] = $this->config['msg']['post_edit_err'];

			return $return;
		}

		//	Successfully edited
		$return['err'] = false;

		return $return;
	}
}
