<?php
/**
 * A single post.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Publication\Post;

class Post extends PostFrame
{
	/**
	 * @var int
	 */
	protected $viewCnt;

	/**
	 * @var string	Datetime
	 */
	protected $publicationDt;

	/**
	 * @var string	Datetime
	 */
	protected $lastEditedDt;

	/**
	 * @param int 			$id
	 * @param int 			$user_id
	 * @param string 		$contents
	 * @param string 		$body
	 * @param string 		$title
	 * @param bool 			$is_premium
	 * @param int 			$view_cnt
	 * @param string 		$publication_dt
	 * @param string 		$last_edited_dt
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 * @param int|null 		$series_id
	 */
	public function __construct(
		int $id,
		int $user_id,
		string $contents,
		string $body,
		string $title,
		bool $is_premium,
		int $view_cnt,
		string $publication_dt,
		string $last_edited_dt,
		?string $subtitle,
		?string $thumbnail,
		?int $series_id
	) {
		parent::__construct(
			$id,
			$user_id,
			$contents,
			$body,
			$title,
			$is_premium,
			$subtitle,
			$thumbnail,
			$series_id
		);

		$this->viewCnt = $view_cnt;
		$this->publicationDt = $publication_dt;
		$this->lastEditedDt = $last_edited_dt;
	}

	/**
	 * @return int
	 */
	public function getViewCnt()
	{
		return $this->viewCnt;
	}

	/**
	 * @return string
	 */
	public function getPublicationDt()
	{
		return $this->publicationDt;
	}

	/**
	 * @return string
	 */
	public function getLastEditedDt()
	{
		return $this->lastEditedDt;
	}
}
