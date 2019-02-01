<?php
/**
* Authenticate the current client.
* Issue access key and update it periodically.
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

namespace Readigm\Security\Auth;

use Readigm\Generator\RandomStringGenerator;
use Readigm\Base\Http\Client;
use Readigm\Security\User\UserManager;
use Readigm\Base\Http\Session\SessionManager;
use Readigm\Security\User\User;

class Authenticator
{
	/**
	* Database connection (PDO)
	*
	* @var \PDO
	*/
	protected $conn;

	/**
	 * @var Client
	 */
	private $client;

	/**
	 * @var SessionManager
	 */
	protected $sessionManager;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @var RandomStringGenerator
	 */
	protected $randomStringGenerator;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * Whether client is logged in
	 *
	 * @var bool
	 */
	private $isLoggedIn = false;

	/**
	 * Currently logged in user
	 *
	 * @var User|null
	 */
	private $currentUser = null;

	/**
	 * @param \PDO 					$conn
	 * @param Client 				$client
	 * @param SessionManager 		$session_manager
	 * @param UserManager 			$user_manager
	 * @param RandomStringGenerator $random_string_generator
	 * @param array 				$config
	 */
	public function __construct(
 		\PDO $conn,
		Client $client,
		SessionManager $session_manager,
		UserManager $user_manager,
		RandomStringGenerator $random_string_generator,
		array $config
	) {
		$this->conn = $conn;
		$this->client = $client;
		$this->sessionManager = $session_manager;
		$this->userManager = $user_manager;
		$this->randomStringGenerator = $random_string_generator;
		$this->config = $config;

		$this->isLoggedIn();
	}

	/**
	 * @return Client
	 */
	public function getClient()
	{
		return $this->client;
	}

	/**
	 * Initialize authentication status of the current client.
	 */
	public function initializeAuthenticationStatus()
	{
		$this->isLoggedIn = false;
		$this->currentUser = null;
	}

	/**
	 * Check if client is logged in.
	 * If access key is valid, return true.
	 * After verifying that this is a valid access key, update it.
	 *
	 * @return bool		Whether client is logged in
	 */
	public function isLoggedIn()
	{
		if (!$this->isLoggedIn) {
			if ($this->checkCurrentAccessKey()) {
				$this->updateAndReissueCurrentAccessKey();

				$this->isLoggedIn = true;
			} else {
				$this->isLoggedIn = false;
			}
		}

		return $this->isLoggedIn;
	}

	/**
	* Returns the data of the currently logged in user.
	*
	* @return User|false
	*/
	public function getCurrentUser()
	{
		if ($this->currentUser === null) {
			if ($this->isLoggedIn) {
				$current_user_id = $this->getCurrentUserID();

				//	Not logged in
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

		//	Not logged in
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
			(session_id, user_id, hash, ip, agent, expn_dt)
			VALUES (:session_id, :user_id, :hash, :ip, :agent, :expn_dt)"
		);
		$query_params = [
			':session_id' => $session_id,
			':user_id' => $user_id,
			':hash' => $access_hash,
			':ip' => inet_pton($ip),
			':agent' => $agent,
			':expn_dt' => date("Y-m-d H:i:s", $expiration_time)
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
			"SELECT hash, ip, agent, expn_dt FROM {$this->config['connected_user_table']}
			WHERE session_id = ?"
		);
		$stmt->execute([$session_id]);

		//	Not logged in
		if ($stmt->rowCount() == 0) {
			$this->deleteCurrentAccessKey();
			$this->sessionManager->regenerateSessionID(false);

			return false;
		}

		$record = $stmt->fetch();

		//	User ip is changed (Maybe bad user)
		if ($ip !== inet_ntop($record['ip'])) {
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
	 * Update current access key.
	 * And reissue access key if expires soon.
	 *
	 * @return bool	Success or failure
	 */
	protected function updateAndReissueCurrentAccessKey()
	{
		$session_id = session_id();

		/* Update ip and agent */

		$ip = $this->client->getIP();
		$agent = $this->client->getAgent();

		$stmt = $this->conn->prepare(
			"UPDATE {$this->config['connected_user_table']}
			SET ip = :ip, agent = :agent
			WHERE session_id = :session_id"
		);
		$query_params = [
			':ip' => inet_pton($ip),
			':agent' => $agent,
			':session_id' => $session_id
		];
		if (!$stmt->execute($query_params)) {
			return false;
		}

		/* Get expiration date of current access key */

		$stmt = $this->conn->prepare(
			"SELECT expn_dt FROM {$this->config['connected_user_table']}
			WHERE session_id = ?"
		);
		$stmt->execute([$session_id]);

		$expn_dt = $stmt->fetchColumn();

		/* If access key expires soon, reissue it */

		if (
			strtotime($expn_dt) - time() <
			$this->config['cookie']['access_key']['expire'] - $this->config['cookie']['access_key']['renew']
		) {
			if (!$this->reissueAccessKey()) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Reissue access key to current user.
	 *
	 * @return bool	Whether reissue is success
	 */
	protected function reissueAccessKey()
	{
		$current_user_id = $this->getCurrentUserID();

		try {
			$this->conn->beginTransaction();

			$this->deleteCurrentAccessKeyRecord();
			$this->addAccessKey($current_user_id);

			$this->conn->commit();
		} catch (\PDOException $e) {
			$this->conn->rollBack();
			error_log("ERROR: " . $e->getMessage() . " on line " . __LINE__);

			return false;
		}

		return true;
	}

	/**
	 * Delete current access key cookie.
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
