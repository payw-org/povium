<?php
/**
 * Manage all auto saved post records.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Post;

use Povium\Base\Database\Record\AbstractRecordManager;
use Povium\Base\Database\Exception\InvalidParameterNumberException;

class AutoSavedPostManager extends AbstractRecordManager
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param array 	$config
	 * @param \PDO   	$conn
	 */
	public function __construct(array $config, \PDO $conn)
	{
		$this->config = $config;
		$this->conn = $conn;

		$this->table = $this->config['auto_saved_post_table'];
	}

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
	 * @param  int	$post_id	Original post id
	 *
	 * @return AutoSavedPost|false
	 */
	public function getAutoSavedPostFromPostID($post_id)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->table}
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
	 * @param string  		$title
	 * @param string  		$body
	 * @param string  		$contents
	 * @param bool 			$is_premium
	 * @param int|null  	$post_id
	 * @param int|null  	$series_id
	 * @param string|null  	$subtitle
	 * @param string|null  	$thumbnail
	 */
	public function addRecord()
	{
		if (func_num_args() != 9) {
			throw new InvalidParameterNumberException('Invalid parameter number for creating "auto_saved_post" record.');
		}

		$args = func_get_args();

		$user_id = $args[0];
		$title = $args[1];
		$body = $args[2];
		$contents = $args[3];
		$is_premium = $args[4];
		$post_id = $args[5];
		$series_id = $args[6];
		$subtitle = $args[7];
		$thumbnail = $args[8];

		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->table}
			(user_id, title, body, contents, is_premium, post_id, series_id, subtitle, thumbnail)
			VALUES (:user_id, :title, :body, :contents, :is_premium, :post_id, :series_id, :subtitle, :thumbnail)"
		);
		$query_params = [
			':user_id' => $user_id,
			':title' => $title,
			':body' => $body,
			':contents' => $contents,
			':is_premium' => $is_premium,
			':post_id' => $post_id,
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
