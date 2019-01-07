<?php
/**
 * Frame for post.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
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
	 * @var string	Json string
	 */
	protected $contents;

	/**
	 * @var string
	 */
	protected $body;

	/**
	 * @var bool
	 */
	protected $isPremium;

	/**
	 * @var string|null
	 */
	protected $title;

	/**
	 * @var string|null
	 */
	protected $subtitle;

	/**
	 * @var string|null
	 */
	protected $thumbnail;

	/**
	 * @var int|null
	 */
	protected $seriesID;

	/**
	 * @param int 			$id
	 * @param int 			$user_id
	 * @param string 		$contents
	 * @param string 		$body
	 * @param bool 			$is_premium
	 * @param string|null 	$title
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 * @param int|null 		$series_id
	 */
	public function __construct(
		int $id,
		int $user_id,
		string $contents,
		string $body,
		bool $is_premium,
		?string $title,
		?string $subtitle,
		?string $thumbnail,
		?int $series_id
	) {
		$this->id = $id;
		$this->userID = $user_id;
		$this->contents = $contents;
		$this->body = $body;
		$this->isPremium = $is_premium;
		$this->title = $title;
		$this->subtitle = $subtitle;
		$this->thumbnail = $thumbnail;
		$this->seriesID = $series_id;
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
	public function getContents()
	{
		return $this->contents;
	}

	/**
	 * @return string
	 */
	public function getBody()
	{
		return $this->body;
	}

	/**
	 * @return bool
	 */
	public function isPremium()
	{
		return $this->isPremium;
	}

	/**
	 * @return string|null
	 */
	public function getTitle()
	{
		return $this->title;
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

	/**
	 * @return int|null
	 */
	public function getSeriesID()
	{
		return $this->seriesID;
	}
}
