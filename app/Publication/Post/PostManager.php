<?php
/**
 * Manage all post record.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Post;

use Povium\Base\Database\Record\AbstractRecordManager;
use Povium\Generator\RandomStringGenerator;
use Povium\Base\Database\Exception\InvalidParameterNumberException;

class PostManager extends AbstractRecordManager
{
	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @var RandomStringGenerator
	 */
	protected $randomStringGenerator;

	/**
	 * @param array 				$config
	 * @param \PDO   				$conn
	 * @param RandomStringGenerator	$generator
	 */
	public function __construct(
		array $config,
 		\PDO $conn,
 		RandomStringGenerator $generator
	) {
		$this->config = $config;
		$this->conn= $conn;
		$this->randomStringGenerator = $generator;

		$this->table = $this->config['post_table'];
	}

	/**
	 * Returns a post instance.
	 *
	 * @param  string	$post_id
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
	 * @param string  		$contents   Json string
	 * @param bool			$is_premium
	 * @param int|null  	$series_id
	 * @param string|null  	$subtitle
	 * @param string|null	$thumbnail
	 */
	public function addRecord()
	{
		if (func_num_args() != 8) {
			throw new InvalidParameterNumberException('Invalid parameter number for creating "Post" record.');
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
			"INSERT INTO {$this->table}
			(id, user_id, title, body, contents, is_premium, series_id, subtitle, thumbnail)
			VALUES (:id, :user_id, :title, :body, :contents, :is_premium, :series_id, :subtitle, :thumbnail)"
		);
		$query_params = [
			':id' => $this->createPostID(),
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
