<?php
/**
 * Post class store published post info.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Post;

class Post extends DefinedPost
{
	/**
	 * @var bool
	 */
	protected $isDeleted;

	/**
	 * @var int
	 */
	protected $viewCnt;

	/**
	 * @var int
	 */
	protected $shareCnt;

	/**
	 * @var string	Datetime
	 */
	protected $publicationDt;

	/**
	 * @var string	Datetime
	 */
	protected $lastEditedDt;

	/**
	 * @param string     	$id
	 * @param int     		$user_id
	 * @param string  		$title
	 * @param string		$body
	 * @param string  		$contents
	 * @param bool    		$is_premium
	 * @param bool    		$is_deleted
	 * @param int     		$view_cnt
	 * @param int     		$share_cnt
	 * @param string  		$publication_dt
	 * @param string  		$last_edited_dt
	 * @param int|null    	$series_id
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 */
	public function __construct(
		string $id,
		int $user_id,
		string $title,
		string $body,
		string $contents,
		bool $is_premium,
		bool $is_deleted,
		int $view_cnt,
		int $share_cnt,
		string $publication_dt,
		string $last_edited_dt,
		?int $series_id,
		?string $subtitle,
		?string $thumbnail
	) {
		$this->id = $id;
		$this->userID = $user_id;
		$this->title = $title;
		$this->body = $body;
		$this->contents = $contents;
		$this->isPremium = $is_premium;
		$this->isDeleted = $is_deleted;
		$this->viewCnt = $view_cnt;
		$this->shareCnt = $share_cnt;
		$this->publicationDt = $publication_dt;
		$this->lastEditedDt = $last_edited_dt;
		$this->seriesID = $series_id;
		$this->subtitle = $subtitle;
		$this->thumbnail = $thumbnail;
	}

	/**
	 * @return bool
	 */
	public function isDeleted()
	{
		return $this->isDeleted;
	}

	/**
	 * @return int
	 */
	public function getViewCnt()
	{
		return $this->viewCnt;
	}

	/**
	 * @return int
	 */
	public function getShareCnt()
	{
		return $this->shareCnt;
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
