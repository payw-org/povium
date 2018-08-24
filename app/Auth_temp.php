<?php
/**
* Manipulate sign in, sign up, and sign out.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium;

use Povium\Hasher;

class Auth
{
	public function isLoggedIn()
	{
		if (!$this->isLoggedIn) {
			if ($this->checkSession($this->getCurrentSession())) {
				$this->updateSession($this->getCurrentSession());

				$this->isLoggedIn = true;
			} else {
				$this->deleteCurrentSession();

				$this->isLoggedIn = false;
			}
		}

		return $this->isLoggedIn;
	}

	/**
	 * Creates session for user who login.
	 * And add a record in DB to authenticate the session.
	 *
	 * @param int $user_id
	 *
	 * @return bool Whether add session is success
	 */
	protected function addSession($user_id)
	{
		$cnonce = $this->generateCnonce();
		$decoded_cnonce = $this->decodeCnonce($cnonce);

		//	Generate nonce using validator part of cnonce.
		$nonce = $this->generateNonce($decoded_cnonce['validator']);

		$ip = $this->getClientIp();

		$agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";

		$expiration_time = $this->config['session_params']['expire'];

		//	Add session record
		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['auth_session_table']}
			(selector, user_id, nonce, ip, agent, expn_dt)
			VALUES (:selector, :user_id, :nonce, :ip, :agent, :expn_dt)"
		);
		$query_params = [
			':selector' => $decoded_cnonce['selector'],
			':user_id' => $user_id,
			':nonce' => $nonce,
			':ip' => $ip,
			':agent' => $agent,
			':expn_dt' => date("Y-m-d H:i:s", $expiration_time)
		];
		if (!$stmt->execute($query_params)) {
			return false;
		}

		//	Finarlly, create session.
		$_SESSION[$this->config['session_params']['name']] = $cnonce;

		return true;
	}

	/**
	 * Check if cnonce session is valid.
	 * Method to authenticate user.
	 *
	 * @param  string $session	Cnonce session to validate
	 *
	 * @return bool	Whether session is valid
	 */
	protected function checkSession($session)
	{
		$cnonce = $session;

		//	Cnonce session is emtpy.
		if (empty($cnonce)) {
			return false;
		}

		//	Invalid legnth
		if (strlen($cnonce) != $this->config['nonce']['cnonce_length']) {
			return false;
		}

		$decoded_cnonce = $this->decodeCnonce($cnonce);

		//	Find session record
		$stmt = $this->conn->prepare(
			"SELECT nonce, expn_dt FROM {$this->config['auth_session_table']}
			WHERE selector = ?"
		);
		$stmt->execute([$decoded_cnonce['selector']]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$record = $stmt->fetch();

		//	Generate nonce using current cnonce.
		$nonce = $this->generateNonce($decoded_cnonce['validator']);

		if (!hash_equals($record['nonce'], $nonce)) {
			return false;
		}

		//	Expired session
		if (strtotime($record['expn_dt']) < time()) {
			$this->deleteSessionRecord($cnonce);

			return false;
		}

		return true;
	}

	/**
	 * Update cnonce session.
	 * Update session record from DB.
	 *
	 * @param  string $session 	Cnonce session to update
	 *
	 * @return bool	Whether update is success
	 */
	protected function updateSession($session)
	{
		$old_cnonce = $session;

		//	Find old session record
		$stmt = $this->conn->prepare(
			"SELECT id FROM {$this->config['auth_session_table']}
			WHERE selector = ?"
		);
		$stmt->execute([$this->decodeCnonce($old_cnonce)['selector']]);

		//	If old session record is not found
		if ($stmt->rowCount() == 0) {
			return false;
		}

		//	Fetch old session record id.
		$session_id = $stmt->fetchColumn();

		//	Generate new cnonce.
		$cnonce = $this->generateCnonce();
		$decoded_cnonce = $this->decodeCnonce($cnonce);

		//	Generate new server nonce.
		$nonce = $this->generateNonce($decoded_cnonce['validator']);

		$ip = $this->getClientIp();

		//	Update session record.
		$stmt = $this->conn->prepare(
			"UPDATE {$this->config['auth_session_table']}
			SET selector = :selector, nonce = :nonce, ip = :ip
			WHERE id = :id"
		);
		$query_params = [
			':selector' => $decoded_cnonce['selector'],
			':nonce' => $nonce,
			':ip' => $ip,
			':id' => $session_id
		];
		if(!$stmt->execute($query_params)) {
			return false;
		}

		//	Update cnonce session.
		$_SESSION[$this->config['session_params']['name']] = $cnonce;

		return true;
	}

	/**
	 * Delete current cnonce session.
	 *
	 * @return void
	 */
	protected function deleteCurrentSession()
	{
		unset($_SESSION[$this->config['session_params']['name']]);
	}

	/**
	 * Delete session record from DB.
	 *
	 * @param  string $session	Cnonce session
	 *
	 * @return bool	Whether deletion is success
	 */
	protected function deleteSessionRecord($session)
	{
		$cnonce = $session;

		$decoded_cnonce = $this->decodeCnonce($cnonce);

		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['auth_session_table']}
			WHERE selector = ?"
		);
		$stmt->execute([$decoded_cnonce['selector']]);

		return $stmt->rowCount() == 1;
	}

	/**
	 * Returns current cnonce session.
	 *
	 * @return string|false
	 */
	protected function getCurrentSession()
	{
		if (isset($_SESSION[$this->config['session_params']['name']])) {
			return $_SESSION[$this->config['session_params']['name']];
		}

		return false;
	}

	/**
	 * Generate client nonce.
	 *
	 * @return string
	 */
	protected function generateCnonce()
 	{
		//	Generate random key.
		$random_key = $this->config['nonce']['cnonce_random_key'];

		//	Generate 96 length unique hash.
		$cnonce = hash('sha384', $random_key . microtime());

		return $cnonce;
	}

	/**
	 * Generate server nonce.
	 *
	 * @param  string	$validator	Validator part of client nonce
	 * @param  int		$rounds     Number of algorithm iterations
	 * @param  string	$salt
	 *
	 * @return string
	 */
	protected function generateNonce($validator, $rounds = 20000, $salt = "")
	{
		if (empty($salt)) {
			//	Generate random salt.
			$salt = $this->config['nonce']['nonce_salt'];
		}

		//	$6$ means sha512
		$nonce = crypt($validator, sprintf('$6$rounds=%d$%s$', $rounds, $salt));

		return $nonce;
	}

	/**
	 * Separate selector part and validator part of cnonce.
	 *
	 * @param  string $cnonce	Client nonce
	 * @return array
	 */
	protected function decodeCnonce($cnonce)
	{
		//	Selector part of cnonce.
		$return['selector'] = substr(
			$cnonce,
			0,
			$this->config['nonce']['cnonce_selector_length']
		);

		//	Validator part of cnonce.
		$return['validator'] = substr(
			$cnonce,
			$this->config['nonce']['cnonce_selector_length']
		);

		return $return;
	}

	/**
	 * Returns client ip.
	 *
	 * @return string
	 */
	public function getClientIp()
	{
		$ip_address = '';

	    if (getenv('HTTP_CLIENT_IP')) {
	        $ip_address = getenv('HTTP_CLIENT_IP');
		}
	    else if(getenv('HTTP_X_FORWARDED_FOR')) {
	        $ip_address = getenv('HTTP_X_FORWARDED_FOR');
		}
	    else if(getenv('HTTP_X_FORWARDED')) {
	        $ip_address = getenv('HTTP_X_FORWARDED');
		}
	    else if(getenv('HTTP_FORWARDED_FOR')) {
	        $ip_address = getenv('HTTP_FORWARDED_FOR');
		}
	    else if(getenv('HTTP_FORWARDED')) {
	       	$ip_address = getenv('HTTP_FORWARDED');
		}
	    else if(getenv('REMOTE_ADDR')) {
	        $ip_address = getenv('REMOTE_ADDR');
		}
	    else {
	        $ip_address = '';
		}

	    return $ip_address;
	}
}
