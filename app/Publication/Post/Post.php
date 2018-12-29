<?php
/**
 * A single post.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
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
	 * @param int	     	$id
	 * @param int     		$user_id
	 * @param string  		$title
	 * @param string		$body
	 * @param string  		$contents
	 * @param bool    		$is_premium
	 * @param int     		$view_cnt
	 * @param string  		$publication_dt
	 * @param string  		$last_edited_dt
	 * @param int|null    	$series_id
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 */
	public function __construct(
		int $id,
		int $user_id,
		string $title,
		string $body,
		string $contents,
		bool $is_premium,
		int $view_cnt,
		string $publication_dt,
		string $last_edited_dt,
		?int $series_id,
		?string $subtitle,
		?string $thumbnail
	) {
		parent::__construct(
			$id,
			$user_id,
			$title,
			$body,
			$contents,
			$is_premium,
			$series_id,
			$subtitle,
			$thumbnail
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
	 * @return string	Datetime
	 */
	public function getPublicationDt()
	{
		return $this->publicationDt;
	}

	/**
	 * @return string	Datetime
	 */
	public function getLastEditedDt()
	{
		return $this->lastEditedDt;
	}
}
