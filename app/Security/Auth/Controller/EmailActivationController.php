<?php
/**
* Control email activation.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Controller;

use Povium\Security\Validator\UserInfo\EmailValidator;
use Povium\Security\Auth\Auth;

class EmailActivationController
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
	 * @var EmailValidator
	 */
	protected $emailValidator;

	/**
	 * @var Auth
	 */
	protected $auth;

	/**
	 * @param array          $config
	 * @param \PDO           $conn
	 * @param EmailValidator $email_validator
	 * @param Auth           $auth
	 */
	public function __construct(
		array $config,
		\PDO $conn,
 		EmailValidator $email_validator,
		Auth $auth
	) {
		$this->config = $config;
		$this->conn = $conn;
		$this->emailValidator = $email_validator;
		$this->auth = $auth;
	}

	/**
	 * @return array
	 */
	public function getConfig()
	{
		return $this->config;
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
		if (empty($this->auth->getCurrentUser())) {
			$return['msg'] = $this->config['msg']['not_logged_in'];

			return $return;
		}

		$user_id = $this->auth->getCurrentUser()['id'];

		$validate_email = $this->emailValidator->validate($email, true);
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
		if (empty($this->auth->getCurrentUser())) {
			$return['code'] = $this->config['code']['not_logged_in'];

			return $return;
		}

		$user_id = $this->auth->getCurrentUser()['id'];

		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['email_waiting_for_activation_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$user_id]);

		//	User not found
		if ($stmt->rowCount() == 0) {
			$return['code'] = $this->config['code']['user_not_found'];

			return $return;
		}

		$record = $stmt->fetch();

		//	Token not match
		if (!hash_equals($record['token'], $token)) {
			$return['code'] = $this->config['code']['token_not_match'];

			return $return;
		}

		//	Request expired
		if (strtotime($record['expn_dt']) < time()) {
			$stmt = $this->conn->prepare(
				"DELETE FROM {$this->config['email_waiting_for_activation_table']}
				WHERE id = ?"
			);
			$stmt->execute([$record['id']]);

			$return['code'] = $this->config['code']['request_expired'];

			return $return;
		}

		/* Activate email address */
		$params = array(
			'is_verified' => true,
			'email' => $record['email']
		);
		$this->auth->getUserManager()->updateUser($record['user_id'], $params);

		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['email_waiting_for_activation_table']}
			WHERE email = ?"
		);
		$stmt->execute([$record['email']]);

		$return['err'] = false;

		return $return;
	}
}
