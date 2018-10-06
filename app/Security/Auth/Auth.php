<?php
/**
* Authenticate the current user.
* Isuue access key and manage it.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth;

use Povium\Base\Http\Session\SessionManager;
use Povium\Base\Http\Client;
use Povium\Security\User\UserManager;
use Povium\Generator\RandomStringGenerator;

class Auth
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
	 * @var Client
	 */
	protected $client;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @var SessionManager
	 */
	protected $sessionManager;

	/**
	 * Whether user is logged in
	 *
	 * @var bool
	 */
	protected $isLoggedIn = false;

	/**
	 * Currently logged in user's info
	 *
	 * @var array 	Associative array
	 */
	protected $currentUser = null;

	/**
	 * @param array          		$config
	 * @param \PDO         	 		$conn
	 * @param RandomStringGenerator	$random_string_generator
	 * @param Client				$client
	 * @param UserManager			$user_manager
	 * @param SessionManager 		$session_manager
	 */
	public function __construct(
		array $config,
 		\PDO $conn,
		RandomStringGenerator $random_string_generator,
		Client $client,
		UserManager $user_manager,
		SessionManager $session_manager
	) {
		$this->config = $config;
		$this->conn = $conn;
		$this->randomStringGenerator = $random_string_generator;
		$this->client = $client;
		$this->userManager = $user_manager;
		$this->sessionManager = $session_manager;

		$this->isLoggedIn();
	}

	/**
	 * @return RandomStringGenerator
	 */
	public function getRandomStringGenerator()
	{
		return $this->randomStringGenerator;
	}

	/**
	 * @return Client
	 */
	public function getClient()
	{
		return $this->client;
	}

	/**
	 * @return UserManager
	 */
	public function getUserManager()
	{
		return $this->userManager;
	}

	/**
	 * @return SessionManager
	 */
	public function getSessionManager()
	{
		return $this->sessionManager;
	}

	/**
	 * Initialize authentication status of the current client.
	 *
	 * @return null
	 */
	public function initializeAuthStatus()
	{
		$this->isLoggedIn = false;
		$this->currentUser = null;
	}

	/**
	 * Check if user is logged in.
	 * If access key is valid, return true.
	 * After verifying that this is a valid access key, update it.
	 *
	 * @return bool		Whether user is logged in
	 */
	public function isLoggedIn()
	{
		if (!$this->isLoggedIn) {
			if ($this->checkCurrentAccessKey()) {
				$this->updateCurrentAccessKey();

				$this->isLoggedIn = true;
			} else {
				$this->isLoggedIn = false;
			}
		}

		return $this->isLoggedIn;
	}

	/**
	* Returns the data of the currently logged in user except the password.
	*
	* @return array|false
	*/
	public function getCurrentUser()
	{
		if ($this->currentUser === null) {
			if ($this->isLoggedIn) {
				$current_user_id = $this->getCurrentUserID();

				//	Not logged in user
				if ($current_user_id === false) {
					return false;
				}

				$this->currentUser = $this->userManager->getUser($current_user_id);
			} else {
				return false;
			}
		}

		return $this->currentUser;
	}

	/**
	 * Get current logged in user id.
	 *
	 * @return int|false	User id
	 */
	protected function getCurrentUserID()
	{
		$session_id = session_id();

		$stmt = $this->conn->prepare(
			"SELECT user_id FROM {$this->config['connected_user_table']}
			WHERE session_id = ?"
		);
		$stmt->execute([$session_id]);

		//	Not logged in user
		if ($stmt->rowCount() == 0) {
			return false;
		}

		return $stmt->fetchColumn();
	}

	/**
	 * Add new access inform.
	 * Add access key cookie for user who logged in. (Store to client side)
	 * Add table record to authenticate access key.	(Store to server side)
	 *
	 * @param int $user_id		User who logged in
	 *
	 * @return bool Whether cookie and record are successfully added
	 */
	public function addAccessKey($user_id)
	{
		//	Generate new key and hash
		$access_key = $this->generateAccessKey();
		$access_hash = $this->generateAccessHash($access_key);

		$session_id = session_id();
		$ip = $this->client->getIP();
		$agent = $this->client->getAgent();

		$expiration_time = time() + $this->config['cookie']['access_key']['expire'];

		/* Add access key record */

		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['connected_user_table']}
			(session_id, hash, user_id, ip, expn_dt, agent)
			VALUES (:session_id, :hash, :user_id, :ip, :expn_dt, :agent)"
		);
		$query_params = [
			':session_id' => $session_id,
			':hash' => $access_hash,
			':user_id' => $user_id,
			':ip' => $ip,
			':expn_dt' => date("Y-m-d H:i:s", $expiration_time),
			':agent' => $agent
		];
		if (!$stmt->execute($query_params)) {
			return false;
		}

		/* Add access key cookie */

		//	Failed to add cookie
		if (!setcookie(
			$this->config['cookie']['access_key']['name'],
			$access_key,
			$expiration_time,
			$this->config['cookie']['access_key']['path'],
			$this->config['cookie']['access_key']['domain'],
			$this->config['cookie']['access_key']['secure'],
			$this->config['cookie']['access_key']['httponly']
		)) {
			return false;
		}

		$_COOKIE[$this->config['cookie']['access_key']['name']] = $access_key;

		return true;
	}

	/**
	 * Check if access key is valid.
	 * Authenticate the client(cookie) via the server(table record).
	 *
	 * @return bool		Whether access key is valid
	 */
	protected function checkCurrentAccessKey()
	{
		//	Access key is not exist
		if (!isset($_COOKIE[$this->config['cookie']['access_key']['name']])) {
			return false;
		}

		$access_key = $_COOKIE[$this->config['cookie']['access_key']['name']];

		$session_id = session_id();
		$ip = $this->client->getIP();
		$agent = $this->client->getAgent();

		$stmt = $this->conn->prepare(
			"SELECT hash, ip, expn_dt, agent FROM {$this->config['connected_user_table']}
			WHERE session_id = ?"
		);
		$stmt->execute([$session_id]);

		//	Not logged in user
		if ($stmt->rowCount() == 0) {
			$this->deleteCurrentAccessKey();
			$this->sessionManager->regenerateSessionID(false, true);

			return false;
		}

		$record = $stmt->fetch();

		//	User ip is changed (Maybe bad user)
		if ($ip !== $record['ip']) {
			// @TODO
		}

		//	User agent is changed (Maybe bad user)
		if ($agent !== $record['agent']) {
			// @TODO
		}

		//	Not matched hash
		if (!$this->verifyAccessKey($access_key, $record['hash'])) {
			$this->deleteCurrentAccessKey();
			$this->sessionManager->regenerateSessionID(false);

			return false;
		}

		//	Login expired
		if (strtotime($record['expn_dt']) < time()) {
			$this->deleteCurrentAccessKey();
			$this->deleteCurrentAccessKeyRecord();
			$this->sessionManager->regenerateSessionID(false, true);

			return false;
		}

		return true;
	}

	/**
	 * Update current access key cookie.
	 * Update current access key record from db.
	 * Renew access key expiration time if needed.
	 *
	 * @return bool	Whether update is success
	 */
	protected function updateCurrentAccessKey()
	{
		$session_id = session_id();
		$ip = $this->client->getIP();
		$agent = $this->client->getAgent();

		/* Fetch access key record */

		$stmt = $this->conn->prepare(
			"SELECT id, ip, expn_dt, agent FROM {$this->config['connected_user_table']}
			WHERE session_id = ?"
		);
		$stmt->execute([$session_id]);

		//	Not logged in user
		if ($stmt->rowCount() == 0) {
			return false;
		}

		$record = $stmt->fetch();

		/* Check params to update */

		$params_to_update = array();

		//	User ip is changed
		if ($ip !== $record['ip']) {
			$params_to_update['ip'] = $ip;
		}

		//	User agent is changed
		if ($agent !== $record['agent']) {
			$params_to_update['agent'] = $agent;
		}

		//	Time to renew access key expiration time
		if (
			strtotime($record['expn_dt']) - time() <
			$this->config['cookie']['access_key']['expire'] - $this->config['cookie']['access_key']['renew']
		) {
			$new_expiration_time = time() + $this->config['cookie']['access_key']['expire'];
			$params_to_update['expn_dt'] = date("Y-m-d H:i:s", $new_expiration_time);
		}

		/* Update access key record */

		//	Nothing to update
		if (empty($params_to_update)) {
			return true;
		}

		$col_list = array();
		$val_list = array();

		foreach ($params_to_update as $col => $val) {
			array_push($col_list, $col . ' = ?');
			array_push($val_list, $val);
		}
		array_push($val_list, $record['id']);

		$set_params = implode(', ', $col_list);

		$stmt = $this->conn->prepare(
			"UPDATE {$this->config['connected_user_table']} SET " . $set_params .
			" WHERE id = ?"
		);
		$stmt->execute($val_list);

		/* Update access key cookie */

		//	No need to update cookie
		if (!isset($new_expiration_time)) {
			return true;
		}

		$access_key = $_COOKIE[$this->config['cookie']['access_key']['name']];

		//	Failed to update cookie
		if (!setcookie(
			$this->config['cookie']['access_key']['name'],
			$access_key,
			$new_expiration_time,
			$this->config['cookie']['access_key']['path'],
			$this->config['cookie']['access_key']['domain'],
			$this->config['cookie']['access_key']['secure'],
			$this->config['cookie']['access_key']['httponly']
		)) {
			return false;
		}

		return true;
	}

	/**
	 * Delete current access key cookie.
	 *
	 * @return null
	 */
	public function deleteCurrentAccessKey()
	{
		setcookie($this->config['cookie']['access_key']['name'], null, -1, '/');
		unset($_COOKIE[$this->config['cookie']['access_key']['name']]);
	}

	/**
	 * Delete current access key record from db.
	 *
	 * @return bool		Whether deletion is success
	 */
	public function deleteCurrentAccessKeyRecord()
	{
		$session_id = session_id();

		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['connected_user_table']}
			WHERE session_id = ?"
		);
		$stmt->execute([$session_id]);

		return $stmt->rowCount() == 1;
	}

	/**
	 * Generate new access key.
	 *
	 * @return string
	 */
	protected function generateAccessKey()
	{
		$random_string = $this->randomStringGenerator->generateRandomString(12);
		$key = hash('ripemd160', $random_string . microtime());

		return $key;
	}

	/**
	 * Generate access hash from access key.
	 *
	 * @param  string $key	Access key
	 *
	 * @return string
	 */
	protected function generateAccessHash($key)
	{
		$hash = hash('sha384', $key);

		return $hash;
	}

	/**
	 * Verifies that a access key matches a access hash.
	 *
	 * @param  string $key
	 * @param  string $hash
	 *
	 * @return bool		Whether a key matches a hash
	 */
	protected function verifyAccessKey($key, $hash)
	{
		$generated_hash = $this->generateAccessHash($key);

		return hash_equals($hash, $generated_hash);
	}
}
