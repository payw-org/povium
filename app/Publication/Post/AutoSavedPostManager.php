<?php
/**
 * Manage all auto saved post records.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Publication\Post;

use Readigm\Base\Database\Record\AbstractRecordManager;
use Readigm\Base\Database\Exception\InvalidParameterNumberException;

class AutoSavedPostManager extends AbstractRecordManager
{
	/**
	 * Returns an auto saved post instance.
	 *
	 * @param  int	$auto_saved_post_id
	 *
	 * @return AutoSavedPost|false
	 */
	public function getAutoSavedPost($auto_saved_post_id)
	{
		$record = $this->getRecord($auto_saved_post_id);

		$auto_saved_post = new AutoSavedPost(...array_values($record));

		return $auto_saved_post;
	}

	/**
	 * Returns an auto saved post instance from original post id.
	 *
	 * @param  int	$post_id	ID of original post which is already posted
	 *
	 * @return AutoSavedPost|false
	 */
	public function getAutoSavedPostFromPostID($post_id)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['table']}
			WHERE post_id = ?"
		);
		$stmt->execute([$post_id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$record = $stmt->fetch();

		$auto_saved_post = new AutoSavedPost(...array_values($record));

		return $auto_saved_post;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param int	 		$user_id
	 * @param string  		$contents
	 * @param string  		$body
	 * @param bool 			$is_premium
	 * @param string|null	$title
	 * @param string|null  	$subtitle
	 * @param string|null  	$thumbnail
	 * @param int|null  	$series_id
	 * @param int|null  	$post_id
	 */
	public function addRecord()
	{
		if (func_num_args() != 9) {
			throw new InvalidParameterNumberException('Invalid parameter number for creating "auto_saved_post" record.');
		}

		$args = func_get_args();

		$user_id = $args[0];
		$contents = $args[1];
		$body = $args[2];
		$is_premium = $args[3];
		$title = $args[4];
		$subtitle = $args[5];
		$thumbnail = $args[6];
		$series_id = $args[7];
		$post_id = $args[8];

		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['table']}
			(user_id, contents, body, is_premium, title, subtitle, thumbnail, series_id, post_id)
			VALUES (:user_id, :contents, :body, :is_premium, :title, :subtitle, :thumbnail, :series_id, :post_id)"
		);
		$query_params = [
			':user_id' => $user_id,
			':contents' => $contents,
			':body' => $body,
			':is_premium' => $is_premium,
			':title' => $title,
			':subtitle' => $subtitle,
			':thumbnail' => $thumbnail,
			':series_id' => $series_id,
			':post_id' => $post_id
		];
		if (!$stmt->execute($query_params)) {
			return false;
		}

		return true;
	}
}
