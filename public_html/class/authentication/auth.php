<?php

/**
* Class Auth
* Manipulate sign in, sign up, and sign out.
*
* @author fairyhooni
* @license MIT
*
*
*/

class Auth{
	/**
	* @var array
	*/
	private $config;


	/**
	* database connection (PDO)
	* @var \PDO
	*/
	private $conn;


	// private $is_logged = NULL;


	// private $curr_user = NULL;


	/**
	* [__construct description]
	* @param PDO $conn
	* @param array $config
	*/
	public function __construct(PDO $conn, array $config){
		$this->conn = $conn;
		$this->config = $config;
	}


	/**
	* [login description]
	* @param  string $email
	* @param  string $password
	* @param  bool $remember [flag for auto login]
	* @return array	['err' is an error flag. 'msg' is an error message.]
	*/
	public function login($email, $password, $remember){
		$return = array('err' => true, 'msg' => '');


		$valid_email = $this->validateEmail($email);
		if($valid_email['err']){			//	invalid email
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		$valid_password = $this->validatePassword($password);
		if($valid_password['err']){			//	invalid password
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		$user_id = $this->getUserID($email);
		if(!$user_id){						//	unregistered email
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		$user = $this->getBaseUser($user_id);
		if(!$user){						//	nonexistent user id
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		if(!$this->passwordVerifyWithRehash($password, $user['password'], $user_id)){		//	incorrect password
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		if(!$user['is_active']){									//	inactive account
			$return['msg'] = $this->config['msg']['account_inactive'];

			return $return;
		}


		//	login success
		$return['err'] = false;

		if(!$this->addSessionAndCookie($user_id, $remember)){		//	if failed auto login setting
			$return['msg'] = $this->config['msg']['system_warning'];
		}


		return $return;
	}



	/**
	* [logout description]
	* delete session about authentication
	* delete cookie about auto login
	* delete table record about auto login
	* @return void
	*/
	public function logout(){
		$this->deleteSession();

		if(isset($_COOKIE['auth_token'])){				//	if auto login cookie is set
			$token = $_COOKIE['auth_token'];			//	token = selector:raw validator

			$encodedToken = $this->encodeToken($token);

			if($token_info = $this->getTokenInfo($encodedToken['selector'])){		//	if table record found
				if(hash_equals($encodedToken['validator'], $token_info['validator'])){		//	if the encoded token matches the record
					$this->deleteTokenInfo($token_info['id']);
				}
			}

			$this->deleteCookie();
		}
	}



	public function register($email, $name, $password){
		// $return = array('err' => true, 'email_msg' => '', 'name_msg' => '', 'password_msg' => '');
		$return = array('err' => true, 'msg' => '');


		$valid_email = $this->validateEmail($email);
		if($valid_email['err']){
			$return['msg'] = $valid_email['msg'];

			return $return;
		}


		$valid_name = $this->validateName($name);
		if($valid_name['err']){
			$return['msg'] = $valid_name['msg'];

			return $return;
		}


		$valid_password = $this->validatePassword($password);
		if($valid_password['err']){
			$return['msg'] = $valid_password['msg'];

			return $return;
		}


		if($this->isEmailTaken($email)){
			$return['msg'] = $this->config['msg']['email_istaken'];

			return $return;
		}


		if($this->isNameTaken($name)){
			$return['msg'] = $this->config['msg']['name_istaken'];

			return $return;
		}


	}


	/**
	* [validateEmail description]
	* @param  string $email
	* @return array 'err' is an error flag. 'msg' is an error message.
	*/
	public function validateEmail($email){
		$return = array('err' => true, 'msg' => '');

		if(strlen($email) < (int)$this->config['len']['email_min_length']){
			$return['msg'] = $this->config['msg']['email_short'];

			return $return;
		}

		if(strlen($email) > (int)$this->config['len']['email_max_length']){
			$return['msg'] = $this->config['msg']['email_long'];

			return $return;
		}

		if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
			$return['msg'] = $this->config['msg']['email_invalid'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}


	/**
	 * [validateName description]
	 * @param  string $name
	 * @return array 'err' is an error flag. 'msg' is an error message.
	 */
	public function validateName($name){
		$return = array('err' => true, 'msg' => '');

		if(strlen($name) < (int)$this->config['len']['name_min_length']){
			$return['msg'] = $this->config['msg']['name_short'];

			return $return;
		}

		if(strlen($name) > (int)$this->config['len']['name_max_length']){
			$return['msg'] = $this->config['msg']['name_long'];

			return $return;
		}

		if(!preg_match($this->config['regexp']['name_regexp_base_1'], $name)){
			$return['msg'] = $this->config['msg']['name_invalid'];

			return $return;
		}

		if(preg_match($this->config['regexp']['name_regexp_banned_1'], $name)){
			$return['msg'] = $this->config['msg']['name_single_korean'];

			return $return;
		}

		if(!preg_match($this->config['regexp']['name_regexp_base_2'], $name)){
			$return['msg'] = $this->config['msg']['name_both_ends_illegal'];

			return $return;
		}

		if(preg_match($this->config['regexp']['name_regexp_banned_2'], $name)){
			$return['msg'] = $this->config['msg']['name_continuous_special_chars'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}


	/**
	* [validatePassword description]
	* @param  string $password
	* @return array ['err' is an error flag. 'msg' is an error message.]
	*/
	public function validatePassword($password){
		$return = array('err' => true, 'msg' => '');

		if(strlen($password) < (int)$this->config['len']['password_min_length']){
			$return['msg'] = $this->config['msg']['password_short'];

			return $return;
		}

		if(strlen($password) > (int)$this->config['len']['password_max_length']){
			$return['msg'] = $this->config['msg']['password_long'];

			return $return;
		}

		if(!preg_match($this->config['regexp']['password_regexp'], $password)){
			$return['msg'] = $this->config['msg']['password_invalid'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}


	/**
	 * [isEmailTaken description]
	 * Check if the email is already taken
	 * Compare case-insensitive
	 * @param  string  $email
	 * @return boolean
	 */
	public function isEmailTaken($email){
		$stmt = $this->conn->prepare("SELECT COUNT(id) FROM {$this->config['table_users']} WHERE LOWER(email) = LOWER(:email)");
		$stmt->execute([':email' => $email]);

		if($stmt->fetchColumn() == 0){
			return false;
		}

		return true;
	}


	/**
	 * [isNameTaken description]
	 * Check if the name is already taken
	 * Compare case-insensitive
	 * @param  string  $name
	 * @return boolean
	 */
	public function isNameTaken($name){
		$stmt = $this->conn->prepare("SELECT COUNT(id) FROM {$this->config['table_users']} WHERE LOWER(name) = LOWER(:name)");
		$stmt->execute([':name' => $name]);

		if($stmt->fetchColumn() == 0){
			return false;
		}

		return true;
	}


	/**
	* [getUserID description]
	* @param  string $email
	* @return int or false
	*/
	public function getUserID($email){
		$stmt = $this->conn->prepare("SELECT id FROM {$this->config['table_users']} WHERE email = :email");
		$stmt->execute([':email' => $email]);

		if($stmt->rowCount() == 0){
			return false;
		}

		return $stmt->fetchColumn();
	}


	/**
	* [getBaseUser description]
	* @param  int $user_id
	* @return array or false
	*/
	public function getBaseUser($user_id){
		$stmt = $this->conn->prepare("SELECT id, email, password, is_active FROM {$this->config['table_users']} WHERE id = :id");
		$stmt->execute([':id' => $user_id]);

		if($stmt->rowCount() == 0){
			return false;
		}

		return $stmt->fetch();
	}


	/**
	* [getUser description]
	* @param  int  $user_id
	* @param  boolean $with_pw [if it is true, return with password.]
	* @return array
	* @return bool false
	*/
	public function getUser($user_id, $with_pw=false){
		$stmt = $this->conn->prepare("SELECT * FROM {$this->config['table_users']} WHERE id = :id");
		$stmt->execute([':id' => $user_id]);

		if($stmt->rowCount() == 0){
			return false;
		}

		$user = $stmt->fetch();

		if(!$with_pw){
			unset($user['password']);
		}

		return $user;
	}


	/**
	* [generateRandomHash description]
	* @param  int $len [length of random hash (real length is $len * 2)]
	* @return string
	*/
	public function generateRandomHash($len){
		return bin2hex(openssl_random_pseudo_bytes($len));
	}


	/**
	* [getPasswordHash description]
	* @param  string $raw_pw
	* @return string
	*/
	private function getPasswordHash($raw_pw){
		return password_hash($raw_pw, PASSWORD_DEFAULT, $this->config['pw_hash_options']);
	}


	/**
	* [passwordVerifyWithRehash description]
	* Verify password and rehash if hash options is changed.
	* @param  string $raw_pw
	* @param  string $hash
	* @param  int $user_id
	* @return bool         [if password match, return true.]
	*/
	private function passwordVerifyWithRehash($raw_pw, $hash, $user_id){
		if(!password_verify($raw_pw, $hash)){
			return false;
		}

		if(password_needs_rehash($hash, PASSWORD_DEFAULT, $this->config['pw_hash_options'])){
			$new_hash = getPasswordHash($raw_pw);

			$stmt = $this->conn->prepare("UPDATE {$this->config['table_users']} SET password = :password WHERE id = :id");
			$stmt->execute([':password' => $new_hash, ':id' => $user_id]);
		}

		return true;
	}


	/**
	* [addSessionAndCookie description]
	* Creates a session for a specified user_id
	* Creates cookie and table record about token for auto login
	* @param int $user_id
	* @param bool $remember [flag for auto login]
	* @return bool
	*/
	private function addSessionAndCookie($user_id, $remember){
		$_SESSION['user_id'] = $user_id;
		$stmt = $this->conn->prepare("UPDATE {$this->config['table_users']} SET last_login_dt = :last_login_dt WHERE id = :id");
		$stmt->execute([':last_login_dt' => date("Y-m-d H:i:s", time()), ':id' => $user_id]);

		if($remember){
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

			if(!$stmt->execute($query_params)){
				return false;
			}

			setcookie('auth_token', $token, $expiration_time, $this->config['cookie_params']['path'], $this->config['cookie_params']['domain']);
		}

		return true;
	}


	/**
	* [isLoggedIn description]
	* Check if visitor is logged in.
	* Check if auto login is possible.
	* If possible, log in automatically.
	* @return boolean
	*/
	public function isLoggedIn(){
		if($this->checkSession()){
			return true;
		}

		if(($user_id = $this->checkCookie()) !== false){
			$_SESSION['user_id'] = $user_id;

			return true;
		}

		return false;
	}


	/**
	* [getCurrentUser description]
	* Get current user's info from database
	* @return array user info associative array
	* @return bool false if no current user
	*/
	public function getCurrentUser(){
		return $this->getUser($_SESSION['user_id']);
	}


	/**
	* [checkSession description]
	* @return boolean
	*/
	private function checkSession(){
		if(!isset($_SESSION['user_id'])){
			return false;
		}

		return true;
	}


	/**
	* [checkCookie description]
	* Check cookie for auto login
	* Authenticate token
	* @return int user_id for auto login
	* @return boolean false if auto login fails.
	*/
	private function checkCookie(){
		if(!isset($_COOKIE['auth_token'])){
			return false;
		}

		$encodedToken = $this->encodeToken($_COOKIE['auth_token']);	//	token = selector:validator

		if(!$token_info = $this->getTokenInfo($encodedToken['selector'])){		//	if selector invalid
			$this->deleteCookie();

			return false;
		}

		if(!hash_equals($encodedToken['validator'], $token_info['validator'])){			//	if validator invalid
			$this->deleteCookie();

			return false;
		}

		if(strtotime($token_info['expn_dt']) < time()){				//	if token has already expired
			$this->deleteCookie();
			$this->deleteTokenInfo($token_info['id']);

			return false;
		}

		return $token_info['user_id'];
	}


	/**
	* [encodeToken description]
	* @param  string $token [selector:raw validator]
	* @return array        [selector, validator]
	*/
	private function encodeToken($token){
		$return = array('selector' => '', 'validator' => '');

		$return['selector'] = strtok($token, ':');
		$return['validator'] = hash('sha256', strtok(':'));

		return $return;
	}


	/**
	* [getTokenInfo description]
	* @param  string $selector
	* @return array token info dictionary
	* @return bool false if token is not selected
	*/
	private function getTokenInfo($selector){
		$stmt = $this->conn->prepare("SELECT * FROM {$this->config['table_tokens']} WHERE selector = :selector");
		$stmt->execute([':selector' => $selector]);

		if($stmt->rowCount() == 0){
			return false;
		}

		return $stmt->fetch();
	}



	/**
	* [deleteSession description]
	*
	*/
	private function deleteSession(){
		unset($_SESSION['user_id']);
		session_destroy();
	}


	/**
	* [deleteCookie description]
	*
	*/
	private function deleteCookie(){
		setcookie('auth_token', "", time() - 3600);
		unset($_COOKIE['auth_token']);
	}


	/**
	* [deleteTokenInfo description]
	* Delete tokeninfo record from table
	* @param  int $token_id
	* @return boolean [if deletion success, return true.]
	*/
	private function deleteTokenInfo($token_id){
		$stmt = $this->conn->prepare("DELETE FROM {$this->config['table_tokens']} WHERE id = :id");
		$stmt->execute([':id' => $token_id]);

		return $stmt->rowCount() == 1;
	}



}

?>
