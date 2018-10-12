<?php
/**
 * Manage all post info.
 * Communicate with post table in database.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Post;

use Povium\Generator\RandomStringGenerator;

class PostManager
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
	 * @param PDO   				$conn
	 * @param RandomStringGenerator	$generator
	 */
	public function __construct(array $config, \PDO $conn, RandomStringGenerator $generator)
	{
		$this->config = $config;
		$this->conn = $conn;
		$this->randomStringGenerator = $generator;
	}

	/**
	 * Returns a post instance;
	 *
	 * @param  string	$post_id
	 *
	 * @return Post|false
	 */
	public function getPost($post_id)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['post_table']}
			WHERE id = ?"
		);
		$stmt->execute([$post_id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$record = $stmt->fetch();

		$post = new Post(...array_values($record));

		return $post;
	}

	/**
	 * Add new post record.
	 *
	 * @param int	  		$user_id
	 * @param string  		$title
	 * @param string  		$contents   Json string
	 * @param bool			$is_premium
	 * @param int|null  	$series_id
	 * @param string|null	$thumbnail
	 * @param string|null  	$subtitle
	 *
	 * @return bool		Whether successfully added
	 */
	public function addPost(
		$user_id,
 		$title,
 		$contents,
 		$is_premium,
 		$series_id,
 		$thumbnail,
 		$subtitle
	) {
		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['post_table']}
			(id, user_id, title, contents, is_premium, series_id, thumbnail, subtitle)
			VALUES (:id, :user_id, :title, :contents, :is_premium, :series_id, :thumbnail, :subtitle)"
		);
		$query_params = [
			':id' => $this->createPostID(),
			':user_id' => $user_id,
			':title' => $title,
			':contents' => $contents,
			':is_premium' => $is_premium,
			':series_id' => $series_id,
			':thumbnail' => $thumbnail,
			':subtitle' => $subtitle
		];
		if (!$stmt->execute($query_params)) {
			return false;
		}

		return true;
	}

	/**
	 * Update some fields data of post record.
	 *
	 * @param  string	$post_id
	 * @param  array 	$params		Assoc array (Field name => New value)
	 *
	 * @return bool		Whether successfully updated
	 */
	public function updatePost($post_id, $params)
	{
		$col_list = array();
		$val_list = array();

		foreach ($params as $col => $val) {
			array_push($col_list, $col . ' = ?');
			array_push($val_list, $val);
		}
		array_push($val_list, $post_id);

		$set_params = implode(', ', $col_list);

		$stmt = $this->conn->prepare(
			"UPDATE {$this->config['post_table']}
 			SET " . $set_params .
			" WHERE id = ?"
		);
		if (!$stmt->execute($val_list)) {
			return false;
		}

		return true;
	}

	/**
	 * Create unique random post id.
	 *
	 * @return string
	 */
	protected function createPostID()
	{
		do {
			$post_id = $this->randomStringGenerator->generateRandomString($this->config['post_id_length']);
		} while ($this->getPost($post_id) !== false);

		return $post_id;
	}
}
