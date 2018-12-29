<?php
/**
 * Controller for validating post form.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 Povium
 */

namespace Readigm\Http\Controller\Post;

use Readigm\Publication\Validator\PostInfo\BodyValidator;
use Readigm\Publication\Validator\PostInfo\ContentsValidator;
use Readigm\Publication\Validator\PostInfo\IsPremiumValidator;
use Readigm\Publication\Validator\PostInfo\SeriesIDValidator;
use Readigm\Publication\Validator\PostInfo\SubtitleValidator;
use Readigm\Publication\Validator\PostInfo\ThumbnailValidator;
use Readigm\Publication\Validator\PostInfo\TitleValidator;
use Readigm\Security\User\User;

class PostFormValidationController
{
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
	 * @var IsPremiumValidator
	 */
	protected $isPremiumValidator;

	/**
	 * @var SeriesIDValidator
	 */
	protected $seriesIDValidator;

	/**
	 * @var SubtitleValidator
	 */
	protected $subtitleValidator;

	/**
	 * @var ThumbnailValidator
	 */
	protected $thumbnailValidator;

	/**
	 * @param TitleValidator 		$title_validator
	 * @param BodyValidator 		$body_validator
	 * @param ContentsValidator 	$contents_validator
	 * @param IsPremiumValidator 	$is_premium_validator
	 * @param SeriesIDValidator 	$series_id_validator
	 * @param SubtitleValidator 	$subtitle_validator
	 * @param ThumbnailValidator 	$thumbnail_validator
	 */
	public function __construct(
		TitleValidator $title_validator,
		BodyValidator $body_validator,
		ContentsValidator $contents_validator,
		IsPremiumValidator $is_premium_validator,
		SeriesIDValidator $series_id_validator,
		SubtitleValidator $subtitle_validator,
		ThumbnailValidator $thumbnail_validator
	) {
		$this->titleValidator = $title_validator;
		$this->bodyValidator = $body_validator;
		$this->contentsValidator = $contents_validator;
		$this->isPremiumValidator = $is_premium_validator;
		$this->seriesIDValidator = $series_id_validator;
		$this->subtitleValidator = $subtitle_validator;
		$this->thumbnailValidator = $thumbnail_validator;
	}

	/**
	 * Check if fields of post form are valid.
	 *
	 * @param User			$user			User who wrote the post
	 * @param int			$authority		Authority level of user
	 * @param string		$title
	 * @param string 		$body
	 * @param string 		$contents
	 * @param bool 			$is_premium
	 * @param int|null 		$series_id
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 * @param bool 			$allow_empty	Flag to allow empty fields
	 *
	 * @return bool
	 */
	public function isValid(
		$user,
		$authority,
		$title,
		$body,
		$contents,
		$is_premium,
		$series_id = null,
		$subtitle = null,
		$thumbnail = null,
		$allow_empty = false
	) {
		if (!empty($title) || !$allow_empty) {
			$validate_title = $this->titleValidator->validate($title);

			//	If invalid title
			if ($validate_title['err']) {
				return false;
			}
		}

		if (!empty($body) || !$allow_empty) {
			$validate_body = $this->bodyValidator->validate($body);

			//	If invalid body
			if ($validate_body['err']) {
				return false;
			}
		}

		$validate_contents = $this->contentsValidator->validate($contents);

		//	If invalid contents
		if ($validate_contents['err']) {
			return false;
		}

		$validate_is_premium = $this->isPremiumValidator->validate($is_premium, $authority);

		//	If invalid is_premium
		if ($validate_is_premium['err']) {
			return false;
		}

		if ($series_id !== null) {
			$validate_series_id = $this->seriesIDValidator->validate($series_id, $user->getID());

			//	If invalid series id
			if ($validate_series_id['err']) {
				return false;
			}
		}

		if ($subtitle !== null) {
			$validate_subtitle = $this->subtitleValidator->validate($subtitle);

			//	If invalid subtitle
			if ($validate_subtitle['err']) {
				return false;
			}
		}

		if ($thumbnail !== null) {
			$validate_thumbnail = $this->thumbnailValidator->validate($thumbnail);

			//	If invalid thumbnail
			if ($validate_thumbnail['err']) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Validate all fields of post form.
	 *
	 * @param User			$user			User who wrote the post
	 * @param int			$authority		Authority level of user
	 * @param string		$title
	 * @param string 		$body
	 * @param string 		$contents
	 * @param bool 			$is_premium
	 * @param int|null 		$series_id
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 *
	 * @return array	Validation results
	 */
	public function validateAllFields(
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
			'title_return' => [
				'err' => true,
				'msg' => ''
			],

			'body_return' => [
				'err' => true,
				'msg' => ''
			],

			'contents_return' => [
				'err' => true,
				'msg' => ''
			],

			'is_premium_return' => [
				'err' => true,
				'msg' => ''
			],

			'series_id_return' => [
				'err' => true,
				'msg' => ''
			],

			'subtitle_return' => [
				'err' => true,
				'msg' => ''
			],

			'thumbnail_return' => [
				'err' => true,
				'msg' => ''
			]
		);

		$validate_title = $this->titleValidator->validate($title);
		$return['title_return']['err'] = $validate_title['err'];
		$return['title_return']['msg'] = $validate_title['msg'];

		$validate_body = $this->bodyValidator->validate($body);
		$return['body_return']['err'] = $validate_body['err'];
		$return['body_return']['msg'] = $validate_body['msg'];

		$validate_contents = $this->contentsValidator->validate($contents);
		$return['contents_return']['err'] = $validate_contents['err'];
		$return['contents_return']['msg'] = $validate_contents['msg'];

		$validate_is_premium = $this->isPremiumValidator->validate($is_premium, $authority);
		$return['is_premium_return']['err'] = $validate_is_premium['err'];
		$return['is_premium_return']['msg'] = $validate_is_premium['msg'];

		if ($series_id === null) {
			$return['series_id_return']['err'] = false;
		} else {
			$validate_series_id = $this->seriesIDValidator->validate($series_id, $user->getID());
			$return['series_id_return']['err'] = $validate_series_id['err'];
			$return['series_id_return']['msg'] = $validate_series_id['msg'];
		}

		if ($subtitle === null) {
			$return['subtitle_return']['err'] = false;
		} else {
			$validate_subtitle = $this->subtitleValidator->validate($subtitle);
			$return['subtitle_return']['err'] = $validate_subtitle['err'];
			$return['subtitle_return']['msg'] = $validate_subtitle['msg'];
		}

		if ($thumbnail === null) {
			$return['thumbnail_return']['err'] = false;
		} else {
			$validate_thumbnail = $this->thumbnailValidator->validate($thumbnail);
			$return['thumbnail_return']['err'] = $validate_thumbnail['err'];
			$return['thumbnail_return']['msg'] = $validate_thumbnail['msg'];
		}

		return $return;
	}
}
