<?php
/**
* Authenticate user and issue access key.
*
* - Main function -
* Login
* Register
* Logout
* Request Email Authentication
* Verify Email Authentication
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium;

use Povium\Base\Session\SessionManager;
use ZxcvbnPhp\Zxcvbn;

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
	protected $conn = null;

	/**
	 * Session manager
	 *
	 * @var SessionManager
	 */
	protected $sessionManager = null;

	/**
	 * Whether user is logged in
	 *
	 * @var bool
	 */
	protected $isLoggedIn = false;

	/**
	 * Data of the currently logged in user
	 *
	 * @var array
	 */
	protected $currentUser = null;

	/**
	* @param \PDO $conn
	*/
	public function __construct(\PDO $conn, SessionManager $session_manager)
	{
		$this->config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php');
		$this->conn = $conn;
		$this->sessionManager = $session_manager;

		$this->isLoggedIn();
	}

	/**
	* Validate account.
	* Then issue access key.
	*
	* @param  string 	$identifier Readable id or Email
	* @param  string 	$password
	*
	* @return array		Error flag and message
	*/
	public function login($identifier, $password)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		/* Validate account */

		$validate_readable_id = $this->validateReadableId($identifier);

		//	Invalid readable id
		if ($validate_readable_id['err']) {
			$validate_email = $this->validateEmail($identifier);

			//	Invalid email
			if ($validate_email['err']) {
				$return['msg'] = $this->config['msg']['account_incorrect'];

				return $return;
			}
		}

		$validate_password = $this->validatePassword($password);

		//	Invalid password
		if ($validate_password['err']) {
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}

		//	Unregistered readable id
		if (false === $user_id = $this->getUserIdFromReadableId($identifier)) {

			//	Unregistered email
			if (false === $user_id = $this->getUserIdFromEmail($identifier)) {
				$return['msg'] = $this->config['msg']['account_incorrect'];

				return $return;
			}
		}

		//	Fetch user data
		$user = $this->getUser($user_id, true);

		//	Password does not match
		if (!$this->verifyPasswordAndRehash($password, $user['password'], $user_id)) {
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}

		//	Deleted account
		if ($user['is_deleted']) {
			$return['msg'] = $this->config['msg']['account_is_deleted'];

			return $return;
		}

		//	Inactive account
		if (!$user['is_active']) {
			$return['msg'] = $this->config['msg']['account_inactive'];

			return $return;
		}

		/* Login processing */

		//	Regenerate session id
		$this->sessionManager->regenerateSessionId(true, true);

		//	Error occurred issuing access key
		if (!$this->addAccessKey($user_id)) {
			$return['msg'] = $this->config['msg']['issuing_access_key_err'];

			return $return;
		}

		//	Login success
		$return['err'] = false;

		//	Update last login date
		$params = array(
			'last_login_dt' => date('Y-m-d H:i:s')
		);
		$this->updateUser($user_id, $params);

		return $return;
	}

	/**
	* Validate inputs to registration.
	* Then add user to db.
	*
	* @param  string $readable_id
	* @param  string $name
	* @param  string $password
	*
	* @return array Error flag and message
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

		if (!$this->addUser($readable_id, $name, $password)) {
			$return['msg'] = $this->config['msg']['registration_err'];

			return $return;
		}

		//	register success
		$return['err'] = false;

		return $return;
	}

	/**
	* Logout the current user.
	* Destroy the current access key.
	*
	* @return null
	*/
	public function logout()
	{
		$this->isLoggedIn = false;
		$this->currentUser = null;

		$this->deleteCurrentAccessKey();
		$this->deleteCurrentAccessKeyRecord();
		$this->sessionManager->regenerateSessionId(false, true);
	}

	/**
	 * Add new email address that waiting for activation.
	 * User cannot add multiple new email address at once.
	 *
	 * @param string $email		New email address
	 * @param string $token		Authentication token
	 *
	 * @return array 	Error flag and message
	 */
	public function addNewEmailAddress($email, $token)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		//	Not logged in
		if (empty($this->getCurrentUser())) {
			$return['msg'] = $this->config['msg']['not_logged_in'];

			return $return;
		}

		$user_id = $this->getCurrentUser()['id'];

		$validate_email = $this->validateEmail($email, true);
		if ($validate_email['err']) {
			$return['msg'] = $validate_email['msg'];

			return $return;
		}

		//	Delete old record of same user
		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['email_waiting_for_activation_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$user_id]);

		//	Add new record
		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['email_waiting_for_activation_table']}
			(user_id, token, email, expn_dt)
			VALUES (:user_id, :token, :email, :expn_dt)"
		);
		$query_params = array(
			':user_id' => $user_id,
			':token' => $token,
			':email' => $email,
			':expn_dt' => date('Y-m-d H:i:s', time() + $this->config['email_activation_expire'])
		);
		if (!$stmt->execute($query_params)) {
			$return['msg'] = $this->config['msg']['activation_email_err'];

			return $return;
		}

		//	Successfully added
		$return['err'] = false;

		return $return;
	}

	/**
	 * Validate email activation request.
	 * Activate email address.
	 *
	 * @param  string $token
	 *
	 * @return array 	Error flag and code
	 */
	public function activateEmailAddress($token)
	{
		$return = array(
			'err' => true,
			'code' => ''
		);

		/* Validate email activation request */

		//	Not logged in
		if (empty($this->getCurrentUser())) {
			$return['code'] = $this->config['err']['code']['not_logged_in'];

			return $return;
		}

		$user_id = $this->getCurrentUser()['id'];

		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['email_waiting_for_activation_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$user_id]);

		//	User not found
		if ($stmt->rowCount() == 0) {
			$return['code'] = $this->config['err']['code']['user_not_found'];

			return $return;
		}

		$record = $stmt->fetch();

		//	Token not match
		if (!hash_equals($record['token'], $token)) {
			$return['code'] = $this->config['err']['code']['token_not_match'];

			return $return;
		}

		//	Request expired
		if (strtotime($record['expn_dt']) < time()) {
			$stmt = $this->conn->prepare(
				"DELETE FROM {$this->config['email_waiting_for_activation_table']}
				WHERE id = ?"
			);
			$stmt->execute([$record['id']]);

			$return['code'] = $this->config['err']['code']['request_expired'];

			return $return;
		}

		/* Activate email address */
		$params = array(
			'is_verified' => true,
			'email' => $record['email']
		);
		$this->updateUser($record['user_id'], $params);

		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['email_waiting_for_activation_table']}
			WHERE email = ?"
		);
		$stmt->execute([$record['email']]);

		$return['err'] = false;

		return $return;
	}

	/**
	* Validate readable id.
	* Check length, regex and duplicate. (Duplicate check is optional.)
	*
	* @param  string $readable_id
	*
	* @return array 	Error flag and message
	*/
	public function validateReadableId($readable_id, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($readable_id)) {
			$return['msg'] = $this->config['msg']['readable_id_empty'];

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
				$return['msg'] = $this->config['msg']['readable_id_is_taken'];

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
	* @return array 	Error flag and message
	*/
	public function validateEmail($email, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($email)) {
			$return['msg'] = $this->config['msg']['email_empty'];

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
				$return['msg'] = $this->config['msg']['email_is_taken'];

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
	* @return array 	Error flag and message
	*/
	public function validateName($name, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($name)) {
			$return['msg'] = $this->config['msg']['name_empty'];

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
				$return['msg'] = $this->config['msg']['name_is_taken'];

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
	* @return array 	Error flag and message
	*/
	public function validatePassword($password)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($password)) {
			$return['msg'] = $this->config['msg']['password_empty'];

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
	 * Returns user id from readable id.
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
	public function getUserIdFromName($name)
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
	public function getUserIdFromEmail($email)
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
	* Return user data.
	*
	* @param  int		$user_id
	* @param  boolean 	$with_password	If it is true, return with password.
	*
	* @return array|false
	*/
	public function getUser($user_id, $with_password = false)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['user_table']}
			WHERE id = ?"
		);
		$stmt->execute([$user_id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$user = $stmt->fetch();

		if (!$with_password) {
			unset($user['password']);
		}

		return $user;
	}

	/**
	* Add new user to DB.
	*
	* @param	string $readable_id
	* @param 	string $name
	* @param 	string $password
	*
	* @return bool If adding new user to DB is failed, return false.
	*/
	public function addUser($readable_id, $name, $password)
	{
		$password_hash = $this->getPasswordHash($password);

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
	* @param  array $params assoc array (column name to update => new value, ...)
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
			"UPDATE {$this->config['user_table']} SET " . $set_params .
			" WHERE id = ?"
		);
		if (!$stmt->execute($val_list)) {
			return false;
		}

		return true;
	}

	/**
	 * Measure password strength.
	 *
	 * @param  string $password
	 *
	 * @return int	Password strength (0 ~ 2)
	 */
	public function getPasswordStrength($password)
	{
		$zxcvbn = new Zxcvbn();

		$score = $zxcvbn->passwordStrength($password)['score'];

		if ($score <= 1) {			//	weak password
			$strength = 0;
		} else if ($score <= 3) {	//	normal password
			$strength = 1;
		} else {					//	safe password
			$strength = 2;
		}

		return $strength;
	}

	/**
	* Returns password hash.
	*
	* @param  string $password	Raw password
	*
	* @return string
	*/
	protected function getPasswordHash($password)
	{
		return password_hash($password, $this->config['password_hash_algo'], $this->config['password_hash_options']);
	}

	/**
	* Verify input password and rehash if hash options is changed.
	*
	* @param  string 	$input_password
	* @param  string 	$password_hash
	* @param  int		$user_id
	*
	* @return bool	If password match, return true.
	*/
	protected function verifyPasswordAndRehash($input_password, $password_hash, $user_id)
	{
		if (!password_verify($input_password, $password_hash)) {
			return false;
		}

		if (password_needs_rehash(
			$password_hash,
 			$this->config['password_hash_algo'],
 			$this->config['password_hash_options']
		)) {
			$new_password_hash = $this->getPasswordHash($input_password);

			$stmt = $this->conn->prepare(
				"UPDATE {$this->config['user_table']} SET password = ?
				WHERE id = ?"
			);
			$stmt->execute([$new_password_hash, $user_id]);
		}

		return true;
	}

	/**
	* @param  int $len Length of random string
	*
	* @return string
	*/
	public function generateRandomString($len)
	{
		return substr(bin2hex(random_bytes($len)), 0, $len);
	}

	/**
	 * Generate a version 4 (random) UUID(Universal Unique IDentifier)
	 * UUID format : 8-4-4-4-12
	 *
	 * @return string uuid
	 */
	public function generateUuidV4()
	{
		$data = random_bytes(16);
		$data[6] = chr(ord($data[6]) & 0x0f | 0x40); 	// set version to 0100
		$data[8] = chr(ord($data[8]) & 0x3f | 0x80); 	// set bits 6-7 to 10

		return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
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
				$current_user_id = $this->getCurrentUserId();

				//	Not logged in user
				if ($current_user_id === false) {
					return false;
				}

				$this->currentUser = $this->getUser($current_user_id);
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
	protected function getCurrentUserId()
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
	protected function addAccessKey($user_id)
	{
		//	Generate new key and hash
		$access_key = $this->generateAccessKey();
		$access_hash = $this->generateAccessHash($access_key);

		$session_id = session_id();
		$ip = $this->getClientIp();
		$agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";

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
		$access_hash = $this->generateAccessHash($access_key);

		$session_id = session_id();
		$ip = $this->getClientIp();
		$agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";

		$stmt = $this->conn->prepare(
			"SELECT hash, ip, expn_dt, agent FROM {$this->config['connected_user_table']}
			WHERE session_id = ?"
		);
		$stmt->execute([$session_id]);

		//	Not logged in user
		if ($stmt->rowCount() == 0) {
			$this->deleteCurrentAccessKey();
			$this->sessionManager->regenerateSessionId(false, true);

			return false;
		}

		$record = $stmt->fetch();

		//	Not matched hash
		if (!hash_equals($record['hash'], $access_hash)) {
			$this->deleteCurrentAccessKey();
			$this->sessionManager->regenerateSessionId(false);

			return false;
		}

		//	Login expired
		if (strtotime($record['expn_dt']) < time()) {
			$this->deleteCurrentAccessKey();
			$this->deleteCurrentAccessKeyRecord();
			$this->sessionManager->regenerateSessionId(false, true);

			return false;
		}

		//	User ip is changed (Maybe bad user)
		if ($ip !== $record['ip']) {
			// @TODO
		}

		//	User agent is changed (Maybe bad user)
		if ($agent !== $record['agent']) {
			// @TODO
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
		$ip = $this->getClientIp();
		$agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";

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
	protected function deleteCurrentAccessKey()
	{
		setcookie($this->config['cookie']['access_key']['name'], null, -1, '/');
		unset($_COOKIE[$this->config['cookie']['access_key']['name']]);
	}

	/**
	 * Delete current access key record from db.
	 *
	 * @return bool		Whether deletion is success
	 */
	protected function deleteCurrentAccessKeyRecord()
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
	public function generateAccessKey()
	{
		$random_string = $this->generateRandomString(12);
		$key = hash('ripemd160', $random_string . microtime());

		return $key;
	}

	/**
	 * Generate access hash using access key.
	 *
	 * @param  string $key	Access key
	 *
	 * @return string
	 */
	public function generateAccessHash($key)
	{
		$hash = hash('sha384', $key);

		return $hash;
	}

	/**
	 * Get client ip.
	 *
	 * @return string
	 */
	public function getClientIp()
	{
		$ip_address = '';

	    if (getenv('HTTP_CLIENT_IP')) {
	        $ip_address = getenv('HTTP_CLIENT_IP');
		}
	    else if (getenv('HTTP_X_FORWARDED_FOR')) {
	        $ip_address = getenv('HTTP_X_FORWARDED_FOR');
		}
	    else if (getenv('HTTP_X_FORWARDED')) {
	        $ip_address = getenv('HTTP_X_FORWARDED');
		}
	    else if (getenv('HTTP_FORWARDED_FOR')) {
	        $ip_address = getenv('HTTP_FORWARDED_FOR');
		}
	    else if (getenv('HTTP_FORWARDED')) {
	       	$ip_address = getenv('HTTP_FORWARDED');
		}
	    else if (getenv('REMOTE_ADDR')) {
	        $ip_address = getenv('REMOTE_ADDR');
		}
	    else {
	        $ip_address = '';
		}

	    return $ip_address;
	}
}
