<?php
/**
* Session manager
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Session;

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
	protected $conn = null;

	/**
	* @param \PDO $conn
	*/
	public function __construct($conn)
	{
		$this->config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/session.php');
		$this->conn = $conn;
	}

	/**
	 * Set custom session config.
	 *
	 * @return null
	 */
	public function setSessionConfig()
	{
		session_set_save_handler(new PdoSessionHandler(), true);
		ini_set('session.gc_maxlifetime', $this->config['gc_maxlifetime']);

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
	public function checkAndSetSessionId()
	{
		$current_session_id = $this->getCurrentSessionId();

		if (!$this->checkSessionId($current_session_id)) {
			$new_session_id = $this->createSessionId($this->config['session_id_length']);
			session_id($new_session_id);
		}
	}

	/**
	 * Customized 'session_regenerate_id'.
	 * Update the current session id with a newly created one.
	 * And keep the current session data.
	 *
	 * @param  boolean $delete_old_session	If true, delete current session immediately.
	 *
	 * @return null
	 */
	public function regenerateSessionId($delete_old_session = false)
	{
		$session_data = $_SESSION;

		if ($delete_old_session) {
			session_destroy();
		}

		session_write_close();

		$new_session_id = $this->createSessionId($this->config['session_id_length']);
		session_id($new_session_id);

		session_start();

		$_SESSION = $session_data;
	}

	/**
	 * Create session id.
	 * Session id characters in the range a-z A-Z 0-9 -(minus) _(underscore).
	 *
	 * @param int $len
	 *
	 * @return string
	 */
	public function createSessionId($len)
	{
		$byte_length = intval(3 * ceil($len / 4.0));

		$session_id = substr(base64_encode(random_bytes($byte_length)), 0, $len);

		$session_id = strtr($session_id, '+/', '-_');

		return $session_id;
	}

	/**
	 * Check if the session id is valid.
	 *
	 * @param  string $session_id
	 *
	 * @return bool Whether session id is valid.
	 */
	public function checkSessionId($session_id)
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

		//	Expired session. (creation date is too old)
		if (strtotime($session_record['creation_dt']) + $this->config['cookie_params']['lifetime'] < time()) {
			return false;
		}

		//	Expired session. (touched date is too old)
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
	public function getCurrentSessionId()
	{
		if (isset($_COOKIE[$this->config['cookie_params']['name']])) {
			return $_COOKIE[$this->config['cookie_params']['name']];
		}

		return false;
	}
}
