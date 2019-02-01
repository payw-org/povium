<?php
/**
* Manage all user record.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Security\User;

use Readigm\Record\AbstractRecordManager;
use Readigm\Record\Exception\InvalidParameterNumberException;

class UserManager extends AbstractRecordManager
{
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
			"SELECT id FROM {$this->config['table']}
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
			"SELECT id FROM {$this->config['table']}
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
			"SELECT id FROM {$this->config['table']}
			WHERE email = ?"
		);
		$stmt->execute([$email]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		return $stmt->fetchColumn();
	}

	/**
	* Returns an user instance.
	*
	* @param  int	$user_id
	*
	* @return User|false
	*/
	public function getUser($user_id)
	{
		$record = $this->getRecord($user_id);

		$user = new User(...array_values($record));

		return $user;
	}

	/**
	* {@inheritdoc}
	*
	* @param string 	$readable_id
	* @param string 	$name
	* @param string 	$password
	*/
	public function addRecord()
	{
		if (func_num_args() != 3) {
			throw new InvalidParameterNumberException('Invalid parameter number for creating "user" record.');
		}

		$args = func_get_args();

		$readable_id = $args[0];
		$name = $args[1];
		$password = $args[2];

		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['table']}
			(readable_id, name, password)
			VALUES (:readable_id, :name, :password)"
		);
		$query_params = [
			':readable_id' => $readable_id,
			':name' => $name,
			':password' => $password
		];
		if (!$stmt->execute($query_params)) {
			return false;
		}

		return true;
	}
}
