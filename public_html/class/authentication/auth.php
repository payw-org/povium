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
	* @param  string $identifier [user_id or email]
	* @param  string $user_pw
	* @param  bool $remember [flag for auto login]
	* @return array	['err' is an error flag. 'msg' is an error message.]
	*/
	public function login($identifier, $user_pw, $remember){
		$return = array('err' => true, 'msg' => '');


		$valid_user_id = $this->validateUserId($identifier);
		if($valid_user_id['err']){				//	invalid user id
			$valid_email = $this->validateEmail($identifier);
			if($valid_email['err']){			//	invalid email
				$return['msg'] = $this->config['msg']['account_incorrect'];

				return $return;
			}
		}


		$valid_user_pw = $this->validateUserPw($user_pw);
		if($valid_user_pw['err']){			//	invalid user pw
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		$uid = $this->getUID($identifier);
		if(!$uid){						//	unregistered user id
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		$user = $this->getBaseUser($uid);
		if(!$user){						//	nonexistent uid
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		if(!$this->passwordVerifyWithRehash($user_pw, $user['user_pw'], $uid)){		//	incorrect password
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}


		if(!$user['isactive']){									//	inactive account
			$return['msg'] = $this->config['msg']['account_inactive'];

			return $return;
		}


		//	login success
		$return['err'] = false;

		if(!$this->addSessionAndCookie($uid, $remember)){
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
			$token = $_COOKIE['auth_token'];			//	token = selector:validator

			$encodedToken = $this->encodeToken($token);

			if($token_info = $this->getTokenInfo($encodedToken['selector'])){		//	if table record found
				if(hash_equals($encodedToken['validator'], $token_info['validator'])){		//	if the encoded token matches the record
					$this->deleteTokenInfo($token_info['id']);
				}
			}

			$this->deleteCookie();
		}
	}



	/**
	* [validateUserId description]
	* @param  string $user_id
	* @return array ['err' is an error flag. 'msg' is an error message.]
	*/
	public function validateUserId($user_id){
		$return = array('err' => true, 'msg' => '');

		if(strlen($user_id) < (int)$this->config['len']['userid_min_length']){
			$return['msg'] = $this->config['msg']['userid_short'];

			return $return;
		}

		if(strlen($user_id) > (int)$this->config['len']['userid_max_length']){
			$return['msg'] = $this->config['msg']['userid_long'];

			return $return;
		}

		if(!preg_match($this->config['regexp']['userid_regexp'], $user_id)){
			$return['msg'] = $this->config['msg']['userid_invalid'];

			return $return;
		}

		$return['err'] = false;

		return $return;
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
	* [validateUserPw description]
	* @param  string $user_pw
	* @return array ['err' is an error flag. 'msg' is an error message.]
	*/
	public function validateUserPw($user_pw){
		$return = array('err' => true, 'msg' => '');

		if(strlen($user_pw) < (int)$this->config['len']['userpw_min_length']){
			$return['msg'] = $this->config['msg']['userpw_short'];

			return $return;
		}

		if(strlen($user_pw) > (int)$this->config['len']['userpw_max_length']){
			$return['msg'] = $this->config['msg']['userpw_long'];

			return $return;
		}

		if(!preg_match($this->config['regexp']['userpw_regexp'], $user_pw)){
			$return['msg'] = $this->config['msg']['userpw_invalid'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}


	/**
	* [getUID description]
	* @param  string $identifier
	* @return int or false
	*/
	public function getUID($identifier){
		$stmt = $this->conn->prepare("SELECT id FROM {$this->config['table_users']} WHERE user_id = :user_id OR email = :email");
		$stmt->execute([':user_id' => $identifier, ':email' => $identifier]);

		if($stmt->rowCount() == 0){
			return false;
		}

		return $stmt->fetchColumn();
	}


	/**
	* [getBaseUser description]
	* @param  int $uid
	* @return array or false
	*/
	public function getBaseUser($uid){
		$stmt = $this->conn->prepare("SELECT id, user_id, email, user_pw, isactive FROM {$this->config['table_users']} WHERE id = :id");
		$stmt->execute([':id' => $uid]);

		if($stmt->rowCount() == 0){
			return false;
		}

		return $stmt->fetch();
	}


	/**
	* [getUser description]
	* @param  int  $uid
	* @param  boolean $with_pw [if it is true, return with user_pw.]
	* @return array
	* @return bool false
	*/
	public function getUser($uid, $with_pw=false){
		$stmt = $this->conn->prepare("SELECT * FROM {$this->config['table_users']} WHERE id = :id");
		$stmt->execute([':id' => $uid]);

		if($stmt->rowCount() == 0){
			return false;
		}

		$user = $stmt->fetch();

		if(!$with_pw){
			unset($user['user_pw']);
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
	* @param  string $raw_pw [description]
	* @param  string $hash   [description]
	* @param  int $uid    [description]
	* @return bool         [if password match, return true.]
	*/
	private function passwordVerifyWithRehash($raw_pw, $hash, $uid){
		if(!password_verify($raw_pw, $hash)){
			return false;
		}

		if(password_needs_rehash($hash, PASSWORD_DEFAULT, $this->config['pw_hash_options'])){
			$new_hash = getPasswordHash($raw_pw);

			$stmt = $this->conn->prepare("UPDATE {$this->config['table_users']} SET user_pw = :user_pw WHERE id = :id");
			$stmt->execute([':user_pw' => $new_hash, ':id' => $uid]);
		}

		return true;
	}


	/**
	* [addSessionAndCookie description]
	* Creates a session for a specified uid
	* Creates cookie and table record about token for auto login
	* @param int $uid
	* @param bool $remember [flag for auto login]
	* @return bool
	*/
	private function addSessionAndCookie($uid, $remember){
		$_SESSION['uid'] = $uid;
		$stmt = $this->conn->prepare("UPDATE {$this->config['table_users']} SET last_login_dt = :last_login_dt WHERE id = :id");
		$stmt->execute([':last_login_dt' => date("Y-m-d H:i:s", time()), ':id' => $uid]);

		if($remember){
			$hash = $this->generateRandomHash(30);
			$token = substr_replace($hash, ':', 20, 0);			//	selector:validator

			$encodedtoken = $this->encodeToken($token);

			$stmt = $this->conn->prepare("INSERT INTO {$this->config['table_tokens']} (selector, validator, uid, expire)
			VALUES (:selector, :validator, :uid, :expire)");
			$expiration_time = time() + $this->config['cookie_params']['expire'];
			$query_params = [
				':selector' => $encodedtoken['selector'],
				':validator' => $encodedtoken['validator'],
				':uid' => $uid,
				':expire' => date("Y-m-d H:i:s", $expiration_time)
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

		if(($uid = $this->checkCookie()) !== false){
			$_SESSION['uid'] = $uid;

			return true;
		}

		return false;
	}


	/**
	* [getCurrentUser description]
	* Get current user's info from database
	* @return array user info dictionary
	* @return bool false if no current user
	*/
	public function getCurrentUser(){
		return $this->getUser($_SESSION['uid']);
	}


	/**
	* [checkSession description]
	* @return boolean
	*/
	private function checkSession(){
		if(!isset($_SESSION['uid'])){
			return false;
		}

		return true;
	}


	/**
	* [checkCookie description]
	* Check cookie for auto login
	* Authenticate token
	* @return int uid for auto login
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

		if(strtotime($token_info['expire']) < time()){				//	if token has already expired
			$this->deleteCookie();
			$this->deleteTokenInfo($token_info['id']);

			return false;
		}

		return $token_info['uid'];
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
		unset($_SESSION['uid']);
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
