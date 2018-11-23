<?php
/**
 * Manage post publication.
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

class PostPublicationController
{
	/**
	 * @var array
	 */
	private $config;

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
	 * Validate post components.
	 * Then create a post record.
	 *
	 * @param  User			$user		User who wrote the post
	 * @param  string  		$title
	 * @param  string		$body
	 * @param  string  		$contents   Json string
	 * @param  bool 		$is_premium
	 * @param  int|null  	$series_id
	 * @param  string|null  $subtitle
	 * @param  string|null  $thumbnail
	 *
	 * @return array 	Error flag and message
	 */
	public function publishPost(
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

		/* Validate post components */

		$validate_title = $this->titleValidator->validate($title);

		//	If invalid title
		if ($validate_title['err']) {
			$return['msg'] = $validate_title['msg'];

			return $return;
		}

		$validate_body = $this->bodyValidator->validate($body);

		//	If invalid body
		if ($validate_body['err']) {
			$return['msg'] = $validate_body['msg'];

			return $return;
		}

		$validate_contents = $this->contentsValidator->validate($contents);

		//	If invalid contents
		if ($validate_contents['err']) {
			$return['msg'] = $validate_contents['msg'];

			return $return;
		}

		//	If subtitle is set
		if ($subtitle !== null) {
			$validate_subtitle = $this->subtitleValidator->validate($subtitle);

			//	If invalid subtitle
			if ($validate_subtitle['err']) {
				$return['msg'] = $validate_subtitle['msg'];

				return $return;
			}
		}

		//	If thumbnail is set
		if ($thumbnail !== null) {
			$validate_thumbnail = $this->thumbnailValidator->validate($thumbnail);

			//	If invalid thumbnail
			if ($validate_thumbnail['err']) {
				$return['msg'] = $validate_thumbnail['msg'];

				return $return;
			}
		}

		//	If want to publish as premium
		if ($is_premium) {
			// @TODO	Check if the user is possible to publish premium post
		}

		//	If series is set
		if ($series_id !== null) {
			// @TODO	Check if the user's series
		}

		/* Publication processing */

		//	If failed to add post record
		if (!$this->postManager->addRecord(
			$user->getID(),
 			$title,
			$body,
 			$contents,
 			$is_premium,
 			$series_id,
			$subtitle,
 			$thumbnail
		)) {
			$return['msg'] = $this->config['msg']['post_publication_err'];

			return $return;
		}

		//	Successfully published
		$return['err'] = false;

		return $return;
	}
}
