<?php
/**
* Session manager
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Base\Http\Session;

class SessionManager
{
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
	 * @var array
	 */
	private $config;

	/**
	 * @param \PDO				$conn
	 * @param PDOSessionHandler $session_handler
	 * @param array 			$config
	 */
	public function __construct(
		\PDO $conn,
		PDOSessionHandler $session_handler,
		array $config
	) {
		$this->conn = $conn;
		$this->sessionHandler = $session_handler;
		$this->config = $config;
	}

	/**
	 * Set custom session config.
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
	 * Customized 'session_start'.
	 * If old session id is invalid, set new one.
	 * Then start session.
	 */
	public function startSession()
	{
		if (!$this->checkSessionID($this->getOldSessionID())) {
			session_id($this->createSessionID());	//	Set new one
		}

		session_start();

		if ($this->isDestroyed()) {
			session_write_close();
			session_id($this->createSessionID());
			session_start();
		}
	}

	/**
	 * Customized 'session_regenerate_id'.
	 * Update the session id with a newly created one.
	 *
	 * @param  boolean $keep_session_data	If false, initialize session data.
	 * @param  boolean $delete_old_session	If true, delete old session immediately.
	 */
	public function regenerateSessionID($keep_session_data = true, $delete_old_session = false)
	{
		//	Store session data
		$temp_session_data = $_SESSION;

		//	Set destroy timestamp
		$_SESSION['destroyed'] = time();

		session_write_close();

		if ($delete_old_session) {
			session_start();
			session_destroy();
			session_write_close();
		}

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
			$_SESSION = $temp_session_data;
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

		//	Expired session (Creation date is too old)
		if (strtotime($session_record['creation_dt']) + $this->config['cookie_params']['lifetime'] < time()) {
			return false;
		}

		//	Expired session (Touched date is too old)
		if (strtotime($session_record['touched_dt']) + $this->config['gc_maxlifetime'] < time()) {
			return false;
		}

		return true;
	}

	/**
	 * Check if the current session is destroyed.
	 *
	 * @return boolean
	 */
	protected function isDestroyed()
	{
		//	Destroyed session
		if (isset($_SESSION['destroyed'])) {
			//	Should not happen usually
			//	This could be attack or due to unstable network
			if ($_SESSION['destroyed'] + $this->config['delay_time'] < time()) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Returns old session id.
	 *
	 * @return	string|false
	 */
	public function getOldSessionID()
	{
		if (isset($_COOKIE[session_name()])) {
			return $_COOKIE[session_name()];
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
