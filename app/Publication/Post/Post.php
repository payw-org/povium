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
	 * @var string
	 */
	private $id;

	/**
	 * @var int
	 */
	private $userID;

	/**
	 * @var string	Json string
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
	private $publicationDt;

	/**
	 * @var string	Datetime
	 */
	private $lastEditedDt;

	/**
	 * @var int|null
	 */
	private $seriesID;

	/**
	 * @var string|null
	 */
	private $thumbnail;

	/**
	 * @var string|null	Json string
	 */
	private $subtitle;

	/**
	 * @param string     	$id
	 * @param int     		$user_id
	 * @param string  		$title
	 * @param string  		$contents
	 * @param bool    		$is_premium
	 * @param bool    		$is_deleted
	 * @param int     		$view_cnt
	 * @param int     		$share_cnt
	 * @param string  		$publication_dt
	 * @param string  		$last_edited_dt
	 * @param int|null    	$series_id
	 * @param string|null 	$thumbnail
	 * @param string|null 	$subtitle
	 */
	public function __construct(
		string $id,
		int $user_id,
		string $title,
		string $contents,
		bool $is_premium,
		bool $is_deleted,
		int $view_cnt,
		int $share_cnt,
		string $publication_dt,
		string $last_edited_dt,
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
		$this->publicationDt = $publication_dt;
		$this->lastEditedDt = $last_edited_dt;
		$this->seriesID = $series_id;
		$this->thumbnail = $thumbnail;
		$this->subtitle = $subtitle;
	}

	/**
	 * @return string
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
	 * @return string	Json string
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
	 * @return string|null	Json string
	 */
	public function getSubtitle()
	{
		return $this->subtitle;
	}
}
