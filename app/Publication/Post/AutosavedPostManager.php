<?php
/**
 * Manage all autosaved post info.
 * Communicate with autosaved_post table in database.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Post;

use Povium\Generator\RandomStringGenerator;

class AutosavedPostManager
{
	/**
	 * @var array
	 */
	protected $config;

	/**
	 * Database connection (PDO)
	 *
	 * @var \PDO
	 */
	protected $conn;

	/**
	 * @var RandomStringGenerator
	 */
	protected $randomStringGenerator;

	/**
	 * @param array 				$config
	 * @param \PDO   				$conn
	 * @param RandomStringGenerator	$generator
	 */
	public function __construct(array $config, \PDO $conn, RandomStringGenerator $generator)
	{
		$this->config = $config;
		$this->conn = $conn;
		$this->randomStringGenerator = $generator;
	}

	/**
	 * Returns an autosaved post instance from id.
	 *
	 * @param  string	$autosaved_post_id
	 *
	 * @return AutosavedPost|false
	 */
	public function getAutoSavedPost($autosaved_post_id)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['autosaved_post_table']}
			WHERE id = ?"
		);
		$stmt->execute([$autosaved_post_id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$record = $stmt->fetch();

		$autosaved_post = new AutosavedPost(...array_values($record));

		return $autosaved_post;
	}

	/**
	 * Returns an autosaved post instance from original post id.
	 *
	 * @param  string	$post_id	Original post id
	 *
	 * @return AutosavedPost|false
	 */
	public function getAutoSavedPostFromPostID($post_id)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['autosaved_post_table']}
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
	 * Add new autosaved post record.
	 *
	 * @param int	 		$user_id
	 * @param string  		$title
	 * @param string  		$body
	 * @param string  		$contents   Json string
	 * @param boolean 		$is_premium
	 * @param string|null  	$post_id
	 * @param int|null  	$series_id
	 * @param string|null  	$subtitle
	 * @param string|null  	$thumbnail
	 *
	 * @return bool		Whether successfully added
	 */
	public function addAutosavedPost(
		$user_id,
		$title,
		$body,
		$contents,
		$is_premium,
		$post_id,
		$series_id,
		$subtitle,
		$thumbnail
	) {
		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['autosaved_post_table']}
			(id, user_id, title, body, contents, is_premium, post_id, series_id, subtitle, thumbnail)
			VALUES (:id, :user_id, :title, :body, :contents, :is_premium, :post_id, :series_id, :subtitle, :thumbnail)"
		);
		$query_params = [
			':id' => $this->createAutosavedPostID(),
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

	public function updateAutosavedPost($autosaved_post_id, $params)
	{

	}

	/**
	 * Create unique random autosaved post id
	 *
	 * @return string
	 */
	protected function createAutosavedPostID()
	{
		do {
			$autosaved_post_id = $this->randomStringGenerator->generateRandomString($this->config['autosaved_post_id_length']);
		} while ($this->getAutoSavedPost($autosaved_post_id) !== false);

		return $autosaved_post_id;
	}
}
