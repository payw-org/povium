<?php
/**
 * Control publishing post.
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

class PostPublicationController
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
	 * Validate post components.
	 * Then publish post.
	 *
	 * @param  string  		$title
	 * @param  string  		$contents   Json string
	 * @param  bool 		$is_premium
	 * @param  int|null  	$series_id
	 * @param  string|null  $thumbnail
	 * @param  string|null  $subtitle
	 *
	 * @return array 	Error flag and message
	 */
	public function publishPost($title, $contents, $is_premium, $series_id = null, $thumbnail = null, $subtitle = null)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		$user = $this->auth->getCurrentUser();

		//	Not logged in
		if (false === $user) {
			$return['msg'] = $this->config['msg']['not_logged_in'];

			return $return;
		}

		/* Validate post components */

		$validate_title = $this->titleValidator->validate($title);

		//	If invalid title
		if ($validate_title['err']) {
			$return['msg'] = $validate_title['msg'];

			return $return;
		}

		$validate_contents = $this->contentsValidator->validate($contents);

		//	If invalid contents
		if ($validate_contents['err']) {
			$return['msg'] = $validate_contents['msg'];

			return $return;
		}

		//	If set thumbnail
		if ($thumbnail !== null) {
			$validate_thumbnail = $this->thumbnailValidator->validate($thumbnail);

			//	If invalid thumbnail
			if ($validate_thumbnail['err']) {
				$return['msg'] = $validate_thumbnail['msg'];

				return $return;
			}
		}

		//	If set subtitle
		if ($subtitle !== null) {
			$validate_subtitle = $this->subtitleValidator->validate($subtitle);

			//	If invalid subtitle
			if ($validate_subtitle['err']) {
				$return['msg'] = $validate_subtitle['msg'];

				return $return;
			}
		}

		//	If want to publish as premium
		if ($is_premium) {
			// @TODO	Check if the current user is possible to publish premium post
		}

		//	If set series
		if ($series_id !== null) {
			// @TODO	Check if the current user's series
		}

		/* All components are valid */

		//	If failed to add post to database
		if (!$this->postManager->addPost(
			$user->getID(),
 			$title,
 			$contents,
 			$is_premium,
 			$series_id,
 			$thumbnail,
 			$subtitle
		)) {
			$return['msg'] = $this->config['msg']['post_publication_err'];

			return $return;
		}

		//	Publication success
		$return['err'] = false;

		return $return;
	}
}
