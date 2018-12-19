<?php
/**
 * Frame for post.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Publication\Post;

abstract class PostFrame
{
	/**
	 * @var int
	 */
	protected $id;

	/**
	 * @var int
	 */
	protected $userID;

	/**
	 * @var string
	 */
	protected $title;

	/**
	 * @var string
	 */
	protected $body;

	/**
	 * @var string	Json string
	 */
	protected $contents;

	/**
	 * @var bool
	 */
	protected $isPremium;

	/**
	 * @var int|null
	 */
	protected $seriesID;

	/**
	 * @var string|null
	 */
	protected $subtitle;

	/**
	 * @var string|null
	 */
	protected $thumbnail;

	/**
	 * @param int 			$id
	 * @param int 			$user_id
	 * @param string 		$title
	 * @param string 		$body
	 * @param string 		$contents
	 * @param bool 			$is_premium
	 * @param int|null 		$series_id
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
		$this->seriesID = $series_id;
		$this->subtitle = $subtitle;
		$this->thumbnail = $thumbnail;
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
	 * @return string
	 */
	public function getBody()
	{
		return $this->body;
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
	 * @return int|null
	 */
	public function getSeriesID()
	{
		return $this->seriesID;
	}

	/**
	 * @return string|null
	 */
	public function getSubtitle()
	{
		return $this->subtitle;
	}

	/**
	 * @return string|null
	 */
	public function getThumbnail()
	{
		return $this->thumbnail;
	}
}
