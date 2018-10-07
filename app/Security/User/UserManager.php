<?php
/**
* Manage all user info.
* Communicate with database User table.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\User;

use Povium\Security\Encoder\PasswordEncoder;

class UserManager
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
	 * @var PasswordEncoder
	 */
	protected $passwordEncoder;

	/**
	 * @param array 			$config
	 * @param \PDO				$conn
	 * @param PasswordEncoder	$password_encoder
	 */
	public function __construct(array $config, \PDO $conn, PasswordEncoder $password_encoder)
	{
		$this->config = $config;
		$this->conn = $conn;
		$this->passwordEncoder = $password_encoder;
	}

	/**
	 * @return PasswordEncoder
	 */
	public function getPasswordEncoder()
	{
		return $this->passwordEncoder;
	}

	/**
	 * Returns user id from readable id.
	 *
	 * @param  string $readable_id
	 *
	 * @return int|false
	 */
	public function getUserIDFromReadableID($readable_id)
	{
		$stmt = $this->conn->prepare(
			"SELECT id FROM {$this->config['user_table']}
			WHERE readable_id = ?"
		);
		$stmt->execute([$readable_id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		return $stmt->fetchColumn();
	}

	/**
	 * Returns user id from name.
	 *
	 * @param  string $name
	 *
	 * @return int|false
	 */
	public function getUserIDFromName($name)
	{
		$stmt = $this->conn->prepare(
			"SELECT id FROM {$this->config['user_table']}
			WHERE name = ?"
		);
		$stmt->execute([$name]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		return $stmt->fetchColumn();
	}

	/**
	 * Returns user id from email.
	 *
	 * @param  string $email
	 *
	 * @return int|false
	 */
	public function getUserIDFromEmail($email)
	{
		$stmt = $this->conn->prepare(
			"SELECT id FROM {$this->config['user_table']}
			WHERE email = ?"
		);
		$stmt->execute([$email]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		return $stmt->fetchColumn();
	}

	/**
	* Returns an user.
	*
	* @param  int	$user_id
	*
	* @return User|false
	*/
	public function getUser($user_id)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['user_table']}
			WHERE id = ?"
		);
		$stmt->execute([$user_id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$record = $stmt->fetch();

		$user = new User(...array_values($record));

		return $user;
	}

	/**
	* Add new user.
	*
	* @param string 	$readable_id
	* @param string 	$name
	* @param string 	$password
	*
	* @return bool
	*/
	public function addUser($readable_id, $name, $password)
	{
		$password_hash = $this->passwordEncoder->encode($password);

		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['user_table']}
			(readable_id, name, password)
			VALUES (:readable_id, :name, :password)"
		);
		$query_params = [
			':readable_id' => $readable_id,
			':name' => $name,
			':password' => $password_hash
		];
		if (!$stmt->execute($query_params)) {
			return false;
		}

		return true;
	}

	/**
	* Update some fields data of user
	*
	* @param  int	$user_id
	* @param  array $params Associative array (column name to update => new value)
	*
	* @return bool
	*/
	public function updateUser($user_id, $params)
	{
		$col_list = array();
		$val_list = array();

		foreach ($params as $col => $val) {
			array_push($col_list, $col . ' = ?');
			array_push($val_list, $val);
		}
		array_push($val_list, $user_id);

		$set_params = implode(', ', $col_list);

		$stmt = $this->conn->prepare(
			"UPDATE {$this->config['user_table']}
 			SET " . $set_params .
			" WHERE id = ?"
		);
		if (!$stmt->execute($val_list)) {
			return false;
		}

		return true;
	}
}
