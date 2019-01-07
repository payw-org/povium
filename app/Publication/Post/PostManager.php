<?php
/**
 * Manage all post records.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Publication\Post;

use Readigm\Base\Database\Record\AbstractRecordManager;
use Readigm\Base\Database\Exception\InvalidParameterNumberException;

class PostManager extends AbstractRecordManager
{
	/**
	 * Returns a post instance.
	 *
	 * @param  int	$post_id
	 *
	 * @return Post|false
	 */
	public function getPost($post_id)
	{
		$record = $this->getRecord($post_id);

		$post = new Post(...array_values($record));

		return $post;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param int	  		$user_id
	 * @param string  		$title
	 * @param string		$body
	 * @param string  		$contents
	 * @param bool			$is_premium
	 * @param int|null  	$series_id
	 * @param string|null  	$subtitle
	 * @param string|null	$thumbnail
	 */
	public function addRecord()
	{
		if (func_num_args() != 8) {
			throw new InvalidParameterNumberException('Invalid parameter number for creating "post" record.');
		}

		$args = func_get_args();

		$user_id = $args[0];
		$title = $args[1];
		$body = $args[2];
		$contents = $args[3];
		$is_premium = $args[4];
		$series_id = $args[5];
		$subtitle = $args[6];
		$thumbnail = $args[7];

		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['table']}
			(user_id, title, body, contents, is_premium, series_id, subtitle, thumbnail)
			VALUES (:user_id, :title, :body, :contents, :is_premium, :series_id, :subtitle, :thumbnail)"
		);
		$query_params = [
			':user_id' => $user_id,
			':title' => $title,
			':body' => $body,
			':contents' => $contents,
			':is_premium' => $is_premium,
			':series_id' => $series_id,
			':subtitle' => $subtitle,
			':thumbnail' => $thumbnail
		];
		if (!$stmt->execute($query_params)) {
			return false;
		}

		return true;
	}
}
