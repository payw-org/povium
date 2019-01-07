<?php
/**
 * A single auto saved post.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Publication\Post;

class AutoSavedPost extends PostFrame
{
	/**
	 * @var string	Datetime
	 */
	protected $creationDt;

	/**
	 * @var string	Datetime
	 */
	protected $lastEditedDt;

	/**
	 * @var int|null	ID of original post which is already posted
	 */
	protected $postID;

	/**
	 * @param int 			$id
	 * @param int 			$user_id
	 * @param string 		$contents
	 * @param string 		$body
	 * @param bool 			$is_premium
	 * @param string 		$creation_dt
	 * @param string 		$last_edited_dt
	 * @param string|null 	$title
	 * @param string|null 	$subtitle
	 * @param string|null 	$thumbnail
	 * @param int|null 		$series_id
	 * @param int|null 		$post_id
	 */
	public function __construct(
		int $id,
		int $user_id,
		string $contents,
		string $body,
		bool $is_premium,
		string $creation_dt,
		string $last_edited_dt,
		?string $title,
		?string $subtitle,
		?string $thumbnail,
		?int $series_id,
		?int $post_id
	) {
		parent::__construct(
			$id,
			$user_id,
			$contents,
			$body,
			$is_premium,
			$title,
			$subtitle,
			$thumbnail,
			$series_id
		);

		$this->creationDt = $creation_dt;
		$this->lastEditedDt = $last_edited_dt;
		$this->postID = $post_id;
	}

	/**
	 * @return string
	 */
	public function getCreationDt()
	{
		return $this->creationDt;
	}

	/**
	 * @return string
	 */
	public function getLastEditedDt()
	{
		return $this->lastEditedDt;
	}

	/**
	 * @return int|null
	 */
	public function getPostID()
	{
		return $this->postID;
	}
}
