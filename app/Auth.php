<?php
/**
* Manipulate sign in, sign up, and sign out.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium;

class Auth
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
	private $conn = null;

	/**
	* @param \PDO $conn
	*/
	public function __construct(\PDO $conn)
	{
		$this->config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php');
		$this->conn = $conn;
	}

	/**
	* Validate account.
	* And set auto login.
	*
	* @param  string 	$identifier Readable id or Email
	* @param  string 	$password
	* @param  bool		$remember 	Flag for auto login
	*
	* @return array	'err' is an error flag. 'msg' is an error message.
	*/
	public function login($identifier, $password, $remember)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		$validate_readable_id = $this->validateReadableId($identifier);
		if ($validate_readable_id['err']) {	//	Invalid readable id
			$validate_email = $this->validateEmail($identifier);
			if ($validate_email['err']) {	//	Invalid email
				$return['msg'] = $this->config['msg']['account_incorrect'];

				return $return;
			}
		}

		$validate_password = $this->validatePassword($password);
		if ($validate_password['err']) {	//	Invalid password
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}

		if (false === $id = $this->getUserIdFromReadableId($identifier)) {	//	Unregistered readable id
			if (false === $id = $this->getUserIdFromEmail($identifier)) {	//	Unregistered email
				$return['msg'] = $this->config['msg']['account_incorrect'];

				return $return;
			}
		}

		$user = $this->getUser($id, array('password', 'is_active'));
		if ($user === false) {				//	Nonexistent id
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}

		if (!$this->verifyPasswordAndRehash($password, $user['password'], $id)) {	//	Incorrect password
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}

		if (!$user['is_active']) {			//	Inactive account
			$return['msg'] = $this->config['msg']['account_inactive'];

			return $return;
		}

		//	Login success
		$return['err'] = false;

		$params = array(
			'last_login_dt' => date('Y-m-d H:i:s', time())
		);
		$this->updateUser($id, $params);	//	Update last login date

		if (!$this->createSessionAndCookie($id, $remember)) {	//	If failed auto login setting
			$return['msg'] = $this->config['msg']['token_insert_to_db_err'];
		}

		return $return;
	}

	/**
	* Validate input.
	* Checks if input is already taken.
	* Add user to db.
	*
	* @param  string $readable_id
	* @param  string $name
	* @param  string $password
	*
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function register($readable_id, $name, $password)
	{
		# $return = array('err' => true, 'email_msg' => '', 'name_msg' => '', 'password_msg' => '');
		$return = array(
			'err' => true,
			'msg' => ''
		);

		$validate_readable_id = $this->validateReadableId($readable_id, true);
		if ($validate_readable_id['err']) {
			$return['msg'] = $validate_readable_id['msg'];

			return $return;
		}

		$validate_name = $this->validateName($name, true);
		if ($validate_name['err']) {
			$return['msg'] = $validate_name['msg'];

			return $return;
		}

		$validate_password = $this->validatePassword($password);
		if ($validate_password['err']) {
			$return['msg'] = $validate_password['msg'];

			return $return;
		}

		if (!$this->createUser($readable_id, $name, $password)) {
			$return['msg'] = $this->config['msg']['user_insert_to_db_err'];

			return $return;
		}

		//	register success
		$return['err'] = false;

		return $return;
	}

	/**
	* Delete session about authentication.
	* Delete cookie about auto login.
	* Delete table record about auto login.
	*
	* @return void
	*/
	public function logout()
	{
		$this->deleteSession();

		if (isset($_COOKIE['auth_token'])) {	//	If auto login cookie is set
			$token = $_COOKIE['auth_token'];	//	token = selector:raw validator

			if ($token_info = $this->getTokenInfo($token)) {
				$this->deleteTokenInfo($token_info['id']);
			}

			$this->deleteCookie();
		}
	}

	/**
	 * Request email authentication.
	 * Add new request info in database.
	 * And delete old request info.
	 *
	 * @param string $email	Email to authenticate
	 * @param string $token Uuid
	 *
	 * @return boolean
	 */
	public function requestEmailAuth($email, $token)
	{
		$user_id = $this->getCurrentUser(array('id'));

		//	Delete old request info
		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['auth_email_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$user_id]);

		//	Add new request info
		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['auth_email_table']}
			(user_id, requested_email, token, expn_dt)
			VALUES (:user_id, :requested_email, :token, :expn_dt)"
		);

		$query_params = array(
			':user_id' => $user_id,
			':requested_email' => $email,
			':token' => $token,
			':expn_dt' => date("Y-m-d H:i:s", time() + $this->config['email_auth_expire'])
		);

		return $stmt->execute($query_params);
	}

	/**
	 * Confirm that the email authentication request is valid.
	 * And update user info.
	 * Delete the authenticated request.
	 *
	 * @param  string $token
	 *
	 * @return int
	 * 0 : NO ERROR
	 * 1 : NONEXISTENT USER ID
	 * 2 : NOT MATCHED TOKEN
	 * 3 : REQUEST EXPIRED
	 */
	public function confirmEmailAuth($token)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['auth_email_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$this->getCurrentUser(array('id'))]);

		//	Nonexistent user id
		if ($stmt->rowCount() == 0) {
			return 1;
		}

		$email_auth_info = $stmt->fetch();

		//	Not matched token
		if (!hash_equals($email_auth_info['token'], $token)) {
			return 2;
		}

		//	Request expired
		if (strtotime($email_auth_info['expn_dt']) < time()) {
			$stmt = $this->conn->prepare(
				"DELETE FROM {$this->config['auth_email_table']}
				WHERE id = ?"
			);
			$stmt->execute([$email_auth_info['id']]);

			return 3 ;
		}

		//	All requires are satisfied
		$params = array(
			'is_verified' => true,
			'email' => $email_auth_info['requested_email']
		);
		$this->updateUser($email_auth_info['user_id'], $params);

		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['auth_email_table']}
			WHERE requested_email = ?"
		);
		$stmt->execute([$email_auth_info['requested_email']]);

		return 0;
	}

	/**
	* Validate readable id.
	* Check length, regex and duplicate. (Duplicate check is optional.)
	*
	* @param  string $readable_id
	*
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function validateReadableId($readable_id, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);


		if (empty($readable_id)) {
			return $return;
		}

		if (!preg_match($this->config['regex']['readable_id_regex_base'], $readable_id)) {
			$return['msg'] = $this->config['msg']['readable_id_invalid'];

			return $return;
		}

		if (strlen($readable_id) < (int)$this->config['len']['readable_id_min_length']) {
			$return['msg'] = $this->config['msg']['readable_id_short'];

			return $return;
		}

		if (strlen($readable_id) > (int)$this->config['len']['readable_id_max_length']) {
			$return['msg'] = $this->config['msg']['readable_id_long'];

			return $return;
		}

		if (preg_match($this->config['regex']['readable_id_regex_banned_1'], $readable_id)) {
			$return['msg'] = $this->config['msg']['readable_id_both_ends_illegal'];

			return $return;
		}

		if (preg_match($this->config['regex']['readable_id_regex_banned_2'], $readable_id)) {
			$return['msg'] = $this->config['msg']['readable_id_continuous_underscore'];

			return $return;
		}

		if ($duplicate_check) {
			if ($this->isReadableIdTaken($readable_id)) {
				$return['msg'] = $this->config['msg']['readable_id_istaken'];

				return $return;
			}
		}

		$return['err'] = false;

		return $return;
	}

	/**
	* Validate email.
	* Check length, regex and duplicate. (Duplicate check is optional.)
	*
	* @param  string $email
	*
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function validateEmail($email, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);


		if (empty($email)) {
			return $return;
		}

		if (strlen($email) < (int)$this->config['len']['email_min_length']) {
			$return['msg'] = $this->config['msg']['email_short'];

			return $return;
		}

		if (strlen($email) > (int)$this->config['len']['email_max_length']) {
			$return['msg'] = $this->config['msg']['email_long'];

			return $return;
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$return['msg'] = $this->config['msg']['email_invalid'];

			return $return;
		}

		if ($duplicate_check) {
			if ($this->isEmailTaken($email)) {
				$return['msg'] = $this->config['msg']['email_istaken'];

				return $return;
			}
		}

		$return['err'] = false;

		return $return;
	}

	/**
	* Validate name.
	* Check length, regex and duplicate. (Duplicate check is optional.)
	*
	* @param  string $name
	*
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function validateName($name, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);


		if (empty($name)) {
			return $return;
		}

		if (!preg_match($this->config['regex']['name_regex_base'], $name)) {
			$return['msg'] = $this->config['msg']['name_invalid'];

			return $return;
		}

		if (mb_strlen($name) < (int)$this->config['len']['name_min_length']) {
			$return['msg'] = $this->config['msg']['name_short'];

			return $return;
		}

		if (mb_strlen($name) > (int)$this->config['len']['name_max_length']) {
			$return['msg'] = $this->config['msg']['name_long'];

			return $return;
		}

		if (preg_match($this->config['regex']['name_regex_banned_1'], $name)) {
			$return['msg'] = $this->config['msg']['name_both_ends_illegal'];

			return $return;
		}

		if (preg_match($this->config['regex']['name_regex_banned_2'], $name)) {
			$return['msg'] = $this->config['msg']['name_continuous_special_chars'];

			return $return;
		}

		if ($duplicate_check) {
			if ($this->isNameTaken($name)) {
				$return['msg'] = $this->config['msg']['name_istaken'];

				return $return;
			}
		}

		$return['err'] = false;

		return $return;
	}

	/**
	* Validate password.
	* Check length and regex.
	*
	* @param  string $password
	*
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function validatePassword($password)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);


		if (empty($password)) {
			return $return;
		}

		if (!preg_match($this->config['regex']['password_regex_base'], $password)) {
			$return['msg'] = $this->config['msg']['password_invalid'];

			return $return;
		}

		if (strlen($password) < (int)$this->config['len']['password_min_length']) {
			$return['msg'] = $this->config['msg']['password_short'];

			return $return;
		}

		if (strlen($password) > (int)$this->config['len']['password_max_length']) {
			$return['msg'] = $this->config['msg']['password_long'];

			return $return;
		}

		if (!preg_match($this->config['regex']['passowrd_regex_required'], $password)) {
			$return['msg'] = $this->config['msg']['password_required_condition'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}

	/**
	* Check if the readable id is already taken
	*
	* @param  string  $readable_id
	*
	* @return boolean
	*/
	public function isReadableIdTaken($readable_id)
	{
		if (false === $this->getUserIdFromReadableId($readable_id)) {
			return false;
		}

		return true;
	}

	/**
	* Check if the email is already taken.
	* Compare case-insensitive.
	*
	* @param  string  $email
	*
	* @return boolean
	*/
	public function isEmailTaken($email)
	{
		if (false === $this->getUserIdFromEmail($email)) {
			return false;
		}

		return true;
	}

	/**
	* Check if the name is already taken.
	* Compare case-insensitive.
	*
	* @param  string  $name
	*
	* @return boolean
	*/
	public function isNameTaken($name)
	{
		if (false === $this->getUserIdFromName($name)) {
			return false;
		}

		return true;
	}

	/**
	 * Get user id from readable id.
	 *
	 * @param  string $readable_id
	 *
	 * @return int|false
	 */
	public function getUserIdFromReadableId($readable_id)
	{
		$stmt = $this->conn->prepare(
			"SELECT id FROM {$this->config['user_table']}
			WHERE readable_id = ?"
		);

		$stmt->execute([$readable_id]);

		return $stmt->fetchColumn();
	}

	/**
	 * Get user id from name.
	 *
	 * @param  string $name
	 *
	 * @return int|false
	 */
	public function getUserIdFromName($name)
	{
		$stmt = $this->conn->prepare(
			"SELECT id FROM {$this->config['user_table']}
			WHERE name = ?"
		);

		$stmt->execute([$name]);

		return $stmt->fetchColumn();
	}

	/**
	 * Get user id from email.
	 *
	 * @param  string $email
	 *
	 * @return int|false
	 */
	public function getUserIdFromEmail($email)
	{
		$stmt = $this->conn->prepare(
			"SELECT id FROM {$this->config['user_table']}
			WHERE email = ?"
		);

		$stmt->execute([$email]);

		return $stmt->fetchColumn();
	}

	/**
	 * Get some fields data of user.
	 *
	 * @param  int 		$id
	 * @param  array 	$params		Field names
	 *
	 * @return array|false
	 */
	public function getUser($id, $params)
	{
		$select_params = implode(', ', $params);

		$stmt = $this->conn->prepare(
			"SELECT " . $select_params . " FROM {$this->config['user_table']}
			WHERE id = ?"
		);

		$stmt->execute([$id]);

		return $stmt->fetch();
	}

	/**
	* Get all fields data of user.
	*
	* @param  int		$id
	* @param  boolean 	$with_pw If it is true, return with password.
	*
	* @return array|false
	*/
	public function getUserAll($id, $with_pw = false)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['user_table']}
			WHERE id = ?"
		);
		$stmt->execute([$id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$user = $stmt->fetch();

		if (!$with_pw) {
			unset($user['password']);
		}

		return $user;
	}

	/**
	* Create new user to DB.
	*
	* @param	string $readable_id
	* @param 	string $name
	* @param 	string $password
	*
	* @return bool If creating new user to DB is failed, return false.
	*/
	public function createUser($readable_id, $name, $password)
	{
		$password_hash = $this->getPasswordHash($password);

		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['user_table']}
			(readable_id, name, password)
			VALUES (?, ?, ?)"
		);

		//	Creating new user is failed
		if (!$stmt->execute([$readable_id, $name, $password_hash])) {
			return false;
		}

		return true;
	}

	/**
	* Update some fields data of user
	*
	* @param  int	$id
	* @param  array $params assoc array(column name to update => new value, ...)
	*
	* @return bool
	*/
	public function updateUser($id, $params)
	{
		$col_list = array();
		$val_list = array();

		foreach ($params as $col => $val) {
			array_push($col_list, $col . ' = ?');
			array_push($val_list, $val);
		}
		array_push($val_list, $id);

		$set_params = implode(', ', $col_list);

		$stmt = $this->conn->prepare(
			"UPDATE {$this->config['user_table']} SET " . $set_params .
			" WHERE id = ?"
		);
		if (!$stmt->execute($val_list)) {
			return false;
		}

		return true;
	}

	/**
	* @param  string $raw_pw Raw password
	*
	* @return string
	*/
	private function getPasswordHash($raw_pw)
	{
		return password_hash($raw_pw, $this->config['password_hash_algo'], $this->config['password_hash_options']);
	}

	/**
	* Verify password and rehash if hash options is changed.
	*
	* @param  string 	$raw_pw
	* @param  string 	$hash
	* @param  int		$id
	*
	* @return bool If password match, return true.
	*/
	private function verifyPasswordAndRehash($raw_pw, $hash, $id)
	{
		if (!password_verify($raw_pw, $hash)) {
			return false;
		}

		if (password_needs_rehash($hash, $this->config['password_hash_algo'], $this->config['password_hash_options'])) {
			$new_hash = getPasswordHash($raw_pw);

			$stmt = $this->conn->prepare(
				"UPDATE {$this->config['user_table']} SET password = :password
 				WHERE id = :id"
			);
			$stmt->execute([':password' => $new_hash, ':id' => $id]);
		}

		return true;
	}

	/**
	* Creates a session for a authorized user.
	* Creates cookie and table record about token for auto login.
	*
	* @param int	$id
	* @param bool	$remember Option for remember me
	*
	* @return bool
	*/
	private function createSessionAndCookie($id, $remember)
	{
		$_SESSION['user_id'] = $id;

		if ($remember) {
			$hash = Hasher::generateRandomHash(30);
			$token = substr_replace($hash, ':', 20, 0);			//	selector:validator

			$encodedtoken = $this->encodeToken($token);

			$stmt = $this->conn->prepare(
				"INSERT INTO {$this->config['auth_autologin_table']}
				(selector, user_id, validator, expn_dt)
				VALUES (:selector, :user_id, :validator, :expn_dt)"
			);
			$expiration_time = time() + $this->config['cookie_params']['expire'];
			$query_params = [
				':selector' => $encodedtoken['selector'],
				':user_id' => $id,
				':validator' => $encodedtoken['validator'],
				':expn_dt' => date("Y-m-d H:i:s", $expiration_time)
			];

			if (!$stmt->execute($query_params)) {
				return false;
			}

			setcookie(
				'auth_token',
				$token,
				$expiration_time,
				$this->config['cookie_params']['path'],
				$this->config['cookie_params']['domain'],
				$this->config['cookie_params']['secure'],
				$this->config['cookie_params']['httponly']
			);
		}

		return true;
	}

	/**
	* Get some fields data of current user.
	*
	* @param  array $params	Field names
	*
	* @return array|false
	*/
	public function getCurrentUser($params)
	{
		return $this->getUser($_SESSION['user_id'], $params);
	}

	/**
	* Check if visitor is logged in.
	* Check if auto login is possible.
	* If possible, log in automatically.
	*
	* @return boolean
	*/
	public function isLoggedIn()
	{
		if ($this->checkSession()) {
			return true;
		}

		if (false !== $id = $this->checkCookie()) {
			$_SESSION['user_id'] = $id;

			return true;
		}

		return false;
	}

	/**
	* Check if user_id session is exist.
	*
	* @return boolean
	*/
	private function checkSession()
	{
		//	Check if session is set
		if (!isset($_SESSION['user_id'])) {
			return false;
		}

		//	Check if user id is exist in db
		if (false === $this->getCurrentUser(array('id'))) {
			return false;
		}

		return true;
	}

	/**
	* Check cookie for auto login.
	* Authenticate token.
	*
	* @return int|false int: when auto login success, false: otherwise
	*/
	private function checkCookie()
	{
		if (!isset($_COOKIE['auth_token'])) {
			return false;
		}

		//	If can not find the token info in the db
		if (!$token_info = $this->getTokenInfo($_COOKIE['auth_token'])) {
			$this->deleteCookie();

			return false;
		}

		//	If token has already expired
		if (strtotime($token_info['expn_dt']) < time()) {
			$this->deleteCookie();
			$this->deleteTokenInfo($token_info['id']);

			return false;
		}

		return $token_info['user_id'];
	}

	/**
	* Delete session about authentication.
	*
	* @return void
	*/
	private function deleteSession()
	{
		unset($_SESSION['user_id']);
		session_destroy();
	}

	/**
	* Delete cookie about auto login.
	*
	* @return void
	*/
	private function deleteCookie()
	{
		setcookie('auth_token', '', time() - 3600);
		unset($_COOKIE['auth_token']);
	}

	/**
	* Encode auto login authentication token.
	*
	* @param  string $token selector:raw validator
	*
	* @return array array('selector' => '', 'validator' => '')
	*/
	private function encodeToken($token)
	{
		$return = array(
			'selector' => '',
			'validator' => ''
		);

		$return['selector'] = strtok($token, ':');
		$return['validator'] = hash('sha256', strtok(':'));

		return $return;
	}

	/**
	* Encode raw token to selector and validator.
	* First, looking for a matched selector.
	* Then check if validator is matched.
	* If all matched, return token info.
	*
	* @param  string $token
	*
	* @return array|false
	*/
	private function getTokenInfo($token)
	{
		$encodedToken = $this->encodeToken($token);

		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['auth_autologin_table']}
 			WHERE selector = ?"
		);
		$stmt->execute([$encodedToken['selector']]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$token_info = $stmt->fetch();

		if (!hash_equals($token_info['validator'], $encodedToken['validator'])) {
			return false;
		}

		return $token_info;
	}

	/**
	* Delete auto login authentication info from table
	*
	* @param  int $token_id
	*
	* @return boolean If deletion success, return true.
	*/
	private function deleteTokenInfo($token_id)
	{
		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['auth_autologin_table']}
 			WHERE id = ?"
		);
		$stmt->execute([$token_id]);

		return $stmt->rowCount() == 1;
	}
}
