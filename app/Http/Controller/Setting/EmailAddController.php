<?php
/**
* Controller for adding new email.
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

namespace Readigm\Http\Controller\Setting;

use Readigm\Security\Validator\UserInfo\EmailValidator;
use Readigm\Security\User\User;

class EmailAddController
{
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
	 * @var array
	 */
	private $config;

	/**
	 * @param \PDO 				$conn
	 * @param EmailValidator 	$email_validator
	 * @param array 			$config
	 */
	public function __construct(
		\PDO $conn,
		EmailValidator $email_validator,
		array $config
	) {
		$this->conn = $conn;
		$this->emailValidator = $email_validator;
		$this->config = $config;
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
			(user_id, email, token, expn_dt)
			VALUES (:user_id, :email, :token, :expn_dt)"
		);
		$query_params = array(
			':user_id' => $user->getID(),
			':email' => $email,
			':token' => $token,
			':expn_dt' => date('Y-m-d H:i:s', time() + $this->config['email_activation_expire'])
		);
		if (!$stmt->execute($query_params)) {
			$return['msg'] = $this->config['msg']['add_record_err'];

			return $return;
		}

		//	Successfully added
		$return['err'] = false;

		return $return;
	}
}
