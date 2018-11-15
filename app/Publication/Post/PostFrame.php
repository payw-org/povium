<?php
/**
 * Frame for post classes.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Post;

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
