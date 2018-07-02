<?php
/**
* Manipulate sign in, sign up, and sign out.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium\Auth;


class Auth {
	/**
	* @var array
	*/
	private $config;


	/**
	* Database connection (PDO)
	* @var \PDO
	*/
	private $conn = NULL;



	/**
	* @param \PDO $conn
	*/
	public function __construct (\PDO $conn) {
		$this->conn = $conn;
		$this->config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/app/auth.php');
	}


	/**
	*
	*/
	public function __destruct () {

	}


	/**
	* Validate email and password.
	* Process auto login
	*
	* @param  string $email
	* @param  string $password
	* @param  bool $remember flag for auto login
	* @return array	'err' is an error flag. 'msg' is an error message.
	*/
	public function login ($email, $password, $remember) {
		$return = array('err' => true, 'msg' => '');


		$valid_email = $this->validateEmail($email);
		if ($valid_email['err']) {			//	invalid email
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		$valid_password = $this->validatePassword($password);
		if ($valid_password['err']) {			//	invalid password
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		$user_id = $this->getUserID($email);
		if (!$user_id) {						//	unregistered email
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		$user = $this->getBaseUser($user_id);
		if (!$user) {						//	nonexistent user id
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		if (!$this->passwordVerifyWithRehash($password, $user['password'], $user_id)) {		//	incorrect password
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		if (!$user['is_active']) {									//	inactive account
			$return['msg'] = $this->config['msg']['account_inactive'];

			return $return;
		}


		//	login success
		$return['err'] = false;

		$params = array(
			'last_login_dt' => date('Y-m-d H:i:s', time())
		);
		$this->updateUser($user_id, $params);		//	update last login date

		if (!$this->addSessionAndCookie($user_id, $remember)) {		//	if failed auto login setting
			$return['msg'] = $this->config['msg']['token_insert_to_db_err'];
		}


		return $return;
	}



	/**
	* Delete session about authentication
	* Delete cookie about auto login
	* Delete table record about auto login
	*
	* @return void
	*/
	public function logout () {
		$this->deleteSession();

		if (isset($_COOKIE['auth_token'])) {			//	if auto login cookie is set
			$token = $_COOKIE['auth_token'];			//	token = selector:raw validator

			if ($token_info = $this->getTokenInfo($token)) {
				$this->deleteTokenInfo($token_info['id']);
			}

			$this->deleteCookie();
		}
	}


	/**
	* Validate input
	* Checks if input is already taken
	* Add user to db
	*
	* @param  string $email
	* @param  string $name
	* @param  string $password
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function register ($email, $name, $password) {
		# $return = array('err' => true, 'email_msg' => '', 'name_msg' => '', 'password_msg' => '');
		$return = array('err' => true, 'msg' => '');


		$verify_email = $this->verifyEmail($email);
		if ($verify_email['err']) {
			$return['msg'] = $verify_email['msg'];

			return $return;
		}

		$verify_name = $this->verifyName($name);
		if ($verify_name['err']) {
			$return['msg'] = $verify_name['msg'];

			return $return;
		}

		$validate_password = $this->validatePassword($password);
		if ($validate_password['err']) {
			$return['msg'] = $validate_password['msg'];

			return $return;
		}

		if (!$this->addUser($email, $name, $password)) {
			$return['msg'] = $this->config['msg']['user_insert_to_db_err'];

			return $return;
		}

		//	register success
		$return['err'] = false;

		return $return;
	}


	/**
	* Verify email input.
	* Validate and Check if input is already taken.
	*
	* @param  string $email
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function verifyEmail ($email) {
		$return = array('err' => true, 'msg' => '');

		$validate_email = $this->validateEmail($email);
		if ($validate_email['err']) {
			$return['msg'] = $validate_email['msg'];

			return $return;
		}

		if ($this->isEmailTaken($email)) {
			$return['msg'] = $this->config['msg']['email_istaken'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}


	/**
	* Verify name input.
	* Validate and Check if input is already taken.
	*
	* @param  string $name
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function verifyName ($name) {
		$return = array('err' => true, 'msg' => '');

		$validate_name = $this->validateName($name);
		if ($validate_name['err']) {
			$return['msg'] = $validate_name['msg'];

			return $return;
		}

		if ($this->isNameTaken($name)) {
			$return['msg'] = $this->config['msg']['name_istaken'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}


	/**
	* @param  string $email
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function validateEmail ($email) {
		$return = array('err' => true, 'msg' => '');


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

		$return['err'] = false;

		return $return;
	}


	/**
	* @param  string $name
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function validateName ($name) {
		$return = array('err' => true, 'msg' => '');


		if (empty($name)) {
			return $return;
		}

		if (strlen($name) < (int)$this->config['len']['name_min_length']) {
			$return['msg'] = $this->config['msg']['name_short'];

			return $return;
		}

		if (strlen($name) > (int)$this->config['len']['name_max_length']) {
			$return['msg'] = $this->config['msg']['name_long'];

			return $return;
		}

		if (!preg_match($this->config['regexp']['name_regexp_base_1'], $name)) {
			$return['msg'] = $this->config['msg']['name_invalid'];

			return $return;
		}

		if (preg_match($this->config['regexp']['name_regexp_banned_1'], $name)) {
			$return['msg'] = $this->config['msg']['name_single_korean'];

			return $return;
		}

		if (!preg_match($this->config['regexp']['name_regexp_base_2'], $name)) {
			$return['msg'] = $this->config['msg']['name_both_ends_illegal'];

			return $return;
		}

		if (preg_match($this->config['regexp']['name_regexp_banned_2'], $name)) {
			$return['msg'] = $this->config['msg']['name_continuous_special_chars'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}


	/**
	* @param  string $password
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function validatePassword ($password) {
		$return = array('err' => true, 'msg' => '');


		if (empty($password)) {
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

		if (!preg_match($this->config['regexp']['password_regexp'], $password)) {
			$return['msg'] = $this->config['msg']['password_invalid'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}


	/**
	* Check if the email is already taken
	* Compare case-insensitive
	*
	* @param  string  $email
	* @return boolean
	*/
	public function isEmailTaken ($email) {
		$stmt = $this->conn->prepare("SELECT COUNT(id) FROM {$this->config['table_users']} WHERE LOWER(email) = LOWER(:email)");
		$stmt->execute([':email' => $email]);

		if ($stmt->fetchColumn() == 0) {
			return false;
		}

		return true;
	}


	/**
	* Check if the name is already taken
	* Compare case-insensitive
	*
	* @param  string  $name
	* @return boolean
	*/
	public function isNameTaken ($name) {
		$stmt = $this->conn->prepare("SELECT COUNT(id) FROM {$this->config['table_users']} WHERE LOWER(name) = LOWER(:name)");
		$stmt->execute([':name' => $name]);

		if ($stmt->fetchColumn() == 0) {
			return false;
		}

		return true;
	}


	/**
	* @param  string $email
	* @return mixed int or false
	*/
	public function getUserID ($email) {
		$stmt = $this->conn->prepare("SELECT id FROM {$this->config['table_users']} WHERE email = :email");
		$stmt->execute([':email' => $email]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		return $stmt->fetchColumn();
	}


	/**
	* Get basic inform
	*
	* @param  int $user_id
	* @return mixed array or false
	*/
	public function getBaseUser ($user_id) {
		$stmt = $this->conn->prepare("SELECT id, email, password, is_active FROM {$this->config['table_users']} WHERE id = :id");
		$stmt->execute([':id' => $user_id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		return $stmt->fetch();
	}


	/**
	* Get entire inform
	*
	* @param  int  $user_id
	* @param  boolean $with_pw If it is true, return with password.
	* @return mixed array or false
	*/
	public function getUser ($user_id, $with_pw=false) {
		$stmt = $this->conn->prepare("SELECT * FROM {$this->config['table_users']} WHERE id = :id");
		$stmt->execute([':id' => $user_id]);

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
	* Insert new user to DB
	*
	* @param string $email
	* @param string $name
	* @param string $password
	* @return bool if adding new user to DB is failed, return false.
	*/
	public function addUser ($email, $name, $password) {
		$at_pos = strpos($email, '@');
		$reformed_email = substr($email, 0, $at_pos) . strtolower(substr($email, $at_pos));

		$password_hash = $this->getPasswordHash($password);


		$stmt = $this->conn->prepare("INSERT INTO {$this->config['table_users']} (email, name, password)
		VALUES (:email, :name, :password)");
		if (!$stmt->execute([':email' => $reformed_email, ':name' => $name, ':password' => $password_hash])) {
			return false;
		}

		return true;
	}


	/**
	* Update some column values of user
	*
	* @param  int $user_id
	* @param  array $params  assoc array(column to update => new value, ...)
	* @return bool
	*/
	public function updateUser ($user_id, $params) {
		$col_list = array();
		$val_list = array();

		foreach ($params as $col => $val) {
			array_push($col_list, $col . ' = ?');
			array_push($val_list, $val);
		}
		array_push($val_list, $user_id);

		$set_params = implode(', ', $col_list);

		$stmt = $this->conn->prepare("UPDATE {$this->config['table_users']} SET " . $set_params . " WHERE id = ?");
		if (!$stmt->execute($val_list)) {
			return false;
		}

		return true;
	}


	/**
	* @param  int $len Length of random hash (real length is $len * 2)
	* @return string
	*/
	public function generateRandomHash ($len) {
		return bin2hex(openssl_random_pseudo_bytes($len));
	}


	/**
	* @param  string $raw_pw Raw password
	* @return string
	*/
	private function getPasswordHash ($raw_pw) {
		return password_hash($raw_pw, PASSWORD_DEFAULT, $this->config['pw_hash_options']);
	}


	/**
	* Verify password and rehash if hash options is changed.
	*
	* @param  string $raw_pw
	* @param  string $hash
	* @param  int $user_id
	* @return bool if password match, return true.
	*/
	private function passwordVerifyWithRehash ($raw_pw, $hash, $user_id) {
		if (!password_verify($raw_pw, $hash)) {
			return false;
		}

		if (password_needs_rehash($hash, PASSWORD_DEFAULT, $this->config['pw_hash_options'])) {
			$new_hash = getPasswordHash($raw_pw);

			$stmt = $this->conn->prepare("UPDATE {$this->config['table_users']} SET password = :password WHERE id = :id");
			$stmt->execute([':password' => $new_hash, ':id' => $user_id]);
		}

		return true;
	}


	/**
	* Creates a session for a specified user_id.
	* Creates cookie and table record about token for auto login.
	*
	* @param int $user_id
	* @param bool $remember Flag for auto login
	* @return bool
	*/
	private function addSessionAndCookie ($user_id, $remember) {
		$_SESSION['user_id'] = $user_id;

		if ($remember) {
			$hash = $this->generateRandomHash(30);
			$token = substr_replace($hash, ':', 20, 0);			//	selector:validator

			$encodedtoken = $this->encodeToken($token);

			$stmt = $this->conn->prepare("INSERT INTO {$this->config['table_tokens']} (selector, validator, user_id, expn_dt)
			VALUES (:selector, :validator, :user_id, :expn_dt)");
			$expiration_time = time() + $this->config['cookie_params']['expire'];
			$query_params = [
				':selector' => $encodedtoken['selector'],
				':validator' => $encodedtoken['validator'],
				':user_id' => $user_id,
				':expn_dt' => date("Y-m-d H:i:s", $expiration_time)
			];

			if (!$stmt->execute($query_params)) {
				return false;
			}

			setcookie('auth_token', $token, $expiration_time, $this->config['cookie_params']['path'], $this->config['cookie_params']['domain']);
		}

		return true;
	}


	/**
	* Check if visitor is logged in.
	* Check if auto login is possible.
	* If possible, log in automatically.
	*
	* @return boolean
	*/
	public function isLoggedIn () {
		if ($this->checkSession()) {
			return true;
		}

		if (($user_id = $this->checkCookie()) !== false) {
			$_SESSION['user_id'] = $user_id;

			return true;
		}

		return false;
	}


	/**
	* Get current user's info from database
	*
	* @return array user info associative array
	* @return boolean false if no current user
	*/
	public function getCurrentUser () {
		return $this->getUser($_SESSION['user_id']);
	}


	/**
	* Check if user_id session is exist.
	*
	* @return boolean
	*/
	private function checkSession () {
		if (!isset($_SESSION['user_id'])) {
			return false;
		}

		return true;
	}


	/**
	* Check cookie for auto login
	* Authenticate token
	*
	* @return int user_id for auto login
	* @return boolean false if auto login fails.
	*/
	private function checkCookie () {
		if (!isset($_COOKIE['auth_token'])) {
			return false;
		}

		if (!$token_info = $this->getTokenInfo($_COOKIE['auth_token'])) {	//	if can not find the token info in the db
			$this->deleteCookie();

			return false;
		}

		if (strtotime($token_info['expn_dt']) < time()) {				//	if token has already expired
			$this->deleteCookie();
			$this->deleteTokenInfo($token_info['id']);

			return false;
		}

		return $token_info['user_id'];
	}


	/**
	* @param  string $token selector:raw validator
	* @return array array('selector' => '', 'validator' => '')
	*/
	private function encodeToken ($token) {
		$return = array('selector' => '', 'validator' => '');

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
	* @return array token info assoc array
	* @return bool false if token is not selected
	*/
	private function getTokenInfo ($token) {
		$encodedToken = $this->encodeToken($token);

		$stmt = $this->conn->prepare("SELECT * FROM {$this->config['table_tokens']} WHERE selector = :selector");
		$stmt->execute([':selector' => $encodedToken['selector']]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$token_info = $stmt->fetch();

		if (!hash_equals($encodedToken['validator'], $token_info['validator'])) {
			return false;
		}

		return $token_info;
	}



	/**
	* Delete session about authentication.
	* @return void
	*/
	private function deleteSession () {
		unset($_SESSION['user_id']);
		session_destroy();
	}


	/**
	* Delete cookie about auto login.
	* @return void
	*/
	private function deleteCookie () {
		setcookie('auth_token', '', time() - 3600);
		unset($_COOKIE['auth_token']);
	}


	/**
	* Delete token info from table
	* @param  int $token_id
	* @return boolean If deletion success, return true.
	*/
	private function deleteTokenInfo ($token_id) {
		$stmt = $this->conn->prepare("DELETE FROM {$this->config['table_tokens']} WHERE id = :id");
		$stmt->execute([':id' => $token_id]);

		return $stmt->rowCount() == 1;
	}



}

?>
