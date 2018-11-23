<?php
/**
 * Manage all autosaved post records.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Post;

use Povium\Base\Database\Record\AbstractRecordManager;
use Povium\Base\Database\Exception\InvalidParameterNumberException;

class AutosavedPostManager extends AbstractRecordManager
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

		$this->table = $this->config['autosaved_post_table'];
	}

	/**
	 * Returns an autosaved post instance.
	 *
	 * @param  int	$autosaved_post_id
	 *
	 * @return AutosavedPost|false
	 */
	public function getAutosavedPost($autosaved_post_id)
	{
		$record = $this->getRecord($autosaved_post_id);

		$autosaved_post = new AutosavedPost(...array_values($record));

		return $autosaved_post;
	}

	/**
	 * Returns an autosaved post instance from original post id.
	 *
	 * @param  int	$post_id	Original post id
	 *
	 * @return AutosavedPost|false
	 */
	public function getAutosavedPostFromPostID($post_id)
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

		$autosaved_post = new AutosavedPost(...array_values($record));

		return $autosaved_post;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param int	 		$user_id
	 * @param string  		$title
	 * @param string  		$body
	 * @param string  		$contents   Json string
	 * @param bool 			$is_premium
	 * @param int|null  	$post_id
	 * @param int|null  	$series_id
	 * @param string|null  	$subtitle
	 * @param string|null  	$thumbnail
	 */
	public function addRecord()
	{
		if (func_num_args() != 9) {
			throw new InvalidParameterNumberException('Invalid parameter number for creating "autosaved_post" record.');
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

	/**
	 * Returns the ID of the last inserted record.
	 *
	 * @return int
	 */
	public function getLastInsertID()
	{
		return $this->conn->lastInsertId();
	}
}
