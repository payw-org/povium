<?php
/**
* Control add new email.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Controller;

use Povium\Security\Validator\UserInfo\EmailValidator;
use Povium\Security\User\User;

class EmailAddController
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
	 * @param array          $config
	 * @param \PDO           $conn
	 * @param EmailValidator $email_validator
	 */
	public function __construct(
		array $config,
		\PDO $conn,
		EmailValidator $email_validator
	) {
		$this->config = $config;
		$this->conn = $conn;
		$this->emailValidator = $email_validator;
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
	 * @param User	 $user		User who requested activation
	 * @param string $token		Authentication token
	 *
	 * @return array 	Error flag and message
	 */
	public function addEmail($email, $user, $token)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		$validate_email = $this->emailValidator->validate($email, true);

		//	Invalid email
		if ($validate_email['err']) {
			$return['msg'] = $validate_email['msg'];

			return $return;
		}

		//	Delete old record of same user
		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['email_requesting_activation_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$user->getID()]);

		//	Add new record
		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['email_requesting_activation_table']}
			(user_id, token, email, expn_dt)
			VALUES (:user_id, :token, :email, :expn_dt)"
		);
		$query_params = array(
			':user_id' => $user->getID(),
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
}
