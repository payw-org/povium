<?php
/**
 * Post class is the post implementation.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Post;

class Post
{
	/**
	 * @var int
	 */
	private $id;

	/**
	 * @var int
	 */
	private $userID;

	/**
	 * @var string
	 */
	private $title;

	/**
	 * @var string	Json string
	 */
	private $contents;

	/**
	 * @var bool
	 */
	private $isPremium;

	/**
	 * @var bool
	 */
	private $isDeleted;

	/**
	 * @var int
	 */
	private $viewCnt;

	/**
	 * @var int
	 */
	private $shareCnt;

	/**
	 * @var string	Datetime
	 */
	private $publishingDt;

	/**
	 * @var string	Datetime
	 */
	private $lastModifiedDt;

	/**
	 * @var int|null
	 */
	private $seriesID;

	/**
	 * @var string|null
	 */
	private $thumbnail;

	/**
	 * @var string|null
	 */
	private $subtitle;

	/**
	 * @param int     		$id
	 * @param int     		$user_id
	 * @param string  		$title
	 * @param string  		$contents
	 * @param bool    		$is_premium
	 * @param bool    		$is_deleted
	 * @param int     		$view_cnt
	 * @param int     		$share_cnt
	 * @param string  		$publishing_dt
	 * @param string  		$last_modified_dt
	 * @param int|null    	$series_id
	 * @param string|null 	$thumbnail
	 * @param string|null 	$subtitle
	 */
	public function __construct(
		int $id,
		int $user_id,
		string $title,
		string $contents,
		bool $is_premium,
		bool $is_deleted,
		int $view_cnt,
		int $share_cnt,
		string $publishing_dt,
		string $last_modified_dt,
		?int $series_id,
		?string $thumbnail,
		?string $subtitle
	) {
		$this->id = $id;
		$this->userID = $user_id;
		$this->title = $title;
		$this->contents = $contents;
		$this->isPremium = $is_premium;
		$this->isDeleted = $is_deleted;
		$this->viewCnt = $view_cnt;
		$this->shareCnt = $share_cnt;
		$this->publishingDt = $publishing_dt;
		$this->lastModifiedDt = $last_modified_dt;
		$this->seriesID = $series_id;
		$this->thumbnail = $thumbnail;
		$this->subtitle = $subtitle;
	}

	/**
	 * @return int
	 */
	public function getID()
	{
		return $this->id;
	}

	/**
	 * @return int
	 */
	public function getUserID()
	{
		return $this->userID;
	}

	/**
	 * @return string
	 */
	public function getTitle()
	{
		return $this->title;
	}

	/**
	 * @return string	Json string
	 */
	public function getContents()
	{
		return $this->contents;
	}

	/**
	 * @return bool
	 */
	public function isPremium()
	{
		return $this->isPremium;
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
	public function getPublishingDt()
	{
		return $this->publishingDt;
	}

	/**
	 * @return string	Datetime
	 */
	public function getLastModifiedDt()
	{
		return $this->lastModifiedDt;
	}

	/**
	 * @return int|null
	 */
	public function getSeriesID()
	{
		return $this->seriesID;
	}

	/**
	 * @return string|null
	 */
	public function getThumbnail()
	{
		return $this->thumbnail;
	}

	/**
	 * @return string|null
	 */
	public function getSubtitle()
	{
		return $this->subtitle;
	}
}
