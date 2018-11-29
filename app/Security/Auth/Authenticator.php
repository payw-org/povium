<?php
/**
* Authenticate the current client.
* Issue access key and update it periodically.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth;

use Povium\Generator\RandomStringGenerator;
use Povium\Base\Http\Client;
use Povium\Security\User\UserManager;
use Povium\Base\Http\Session\SessionManager;
use Povium\Security\User\User;

class Authenticator
{
	/**
	* @var array
	*/
	private $config;

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
	private $client;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @var SessionManager
	 */
	protected $sessionManager;

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

		//	Not logged in
		if ($stmt->rowCount() == 0) {
			$this->deleteCurrentAccessKey();
			$this->sessionManager->regenerateSessionID(false);

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
			':ip' => $ip,
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
