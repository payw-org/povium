<?php
/**
* Session manager
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Http\Session;

class SessionManager
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
	 * @var PDOSessionHandler
	 */
	protected $sessionHandler;

	/**
	 * @param array 			$config
	 * @param \PDO				$conn
	 * @param PDOSessionHandler $session_handler
	 */
	public function __construct(array $config, \PDO $conn, PDOSessionHandler $session_handler)
	{
		$this->config = $config;
		$this->conn = $conn;
		$this->sessionHandler = $session_handler;
	}

	/**
	 * Set custom session config.
	 *
	 * @return null
	 */
	public function setSessionConfig()
	{
		session_set_save_handler($this->sessionHandler, true);

		ini_set('session.gc_maxlifetime', $this->config['gc_maxlifetime']);
		ini_set('session.gc_probability', $this->config['gc_probability']);
		ini_set('session.gc_divisor', $this->config['gc_divisor']);

		session_name($this->config['cookie_params']['name']);
		session_set_cookie_params(
			$this->config['cookie_params']['lifetime'],
 			$this->config['cookie_params']['path'],
 			$this->config['cookie_params']['domain'],
 			$this->config['cookie_params']['secure'],
 			$this->config['cookie_params']['httponly']
		);
	}

	/**
	 * If session id is invalid, set new one.
	 *
	 * @return null
	 */
	public function checkAndSetSessionID()
	{
		$current_session_id = $this->getCurrentSessionID();

		if (!$this->checkSessionID($current_session_id)) {
			$new_session_id = $this->createSessionID();
			session_id($new_session_id);
		}
	}

	/**
	 * Customized 'session_regenerate_id'.
	 * Update the current session id with a newly created one.
	 *
	 * @param  boolean $keep_session_data	If false, initialize session data.
	 * @param  boolean $delete_old_session	If true, delete current session immediately.
	 *
	 * @return null
	 */
	public function regenerateSessionID($keep_session_data = true, $delete_old_session = false)
	{
		//	Store current session data
		$session_data = $_SESSION;

		if ($delete_old_session) {
			session_destroy();
		}
		session_write_close();

		//	Create new session id
		$new_session_id = $this->createSessionID();

		//	Set session id to new one, and start it
		session_id($new_session_id);
		session_start();

		//	Close new session
		session_write_close();

		//	And restart to allow other scripts to use it immediately
		session_id($new_session_id);
		session_start();

		if ($keep_session_data) {
			$_SESSION = $session_data;
		}
	}

	/**
	 * Check if the session id is valid.
	 *
	 * @param  string $session_id
	 *
	 * @return bool Whether session id is valid.
	 */
	protected function checkSessionID($session_id)
	{
		if (empty($session_id)) {
			return false;
		}

		$stmt = $this->conn->prepare(
			"SELECT creation_dt, touched_dt FROM {$this->config['session_table']}
			WHERE id = ?"
		);
		$stmt->execute([$session_id]);

		//	Nonexistent session id
		if ($stmt->rowCount() == 0) {
			return false;
		}

		$session_record = $stmt->fetch();

		//	Expired session. (Creation date is too old)
		if (strtotime($session_record['creation_dt']) + $this->config['cookie_params']['lifetime'] < time()) {
			return false;
		}

		//	Expired session. (Touched date is too old)
		if (strtotime($session_record['touched_dt']) + $this->config['gc_maxlifetime'] < time()) {
			return false;
		}

		return true;
	}

	/**
	 * Returns current session id.
	 *
	 * @return	string|false
	 */
	public function getCurrentSessionID()
	{
		if (isset($_COOKIE[$this->config['cookie_params']['name']])) {
			return $_COOKIE[$this->config['cookie_params']['name']];
		}

		return false;
	}

	/**
	 * Create session id.
	 * Session id characters in the range a-z A-Z 0-9 -(minus) _(underscore).
	 *
	 * @return string
	 */
	protected function createSessionID()
	{
		$len = $this->config['session_id_length'];

		$byte_length = intval(3 * ceil($len / 4.0));

		$session_id = substr(base64_encode(random_bytes($byte_length)), 0, $len);

		$session_id = strtr($session_id, '+/', '-_');

		return $session_id;
	}
}
