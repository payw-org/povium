<?php
/**
* Controller for email activation.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Controller;

use Povium\Security\User\UserManager;
use Povium\Security\User\User;

class EmailActivationController
{
	/* Error codes */
	const USER_NOT_FOUND = 0x01;
	const TOKEN_NOT_MATCH = 0x02;
	const REQUEST_EXPIRED = 0x03;

	/**
	 * @var array
	 */
	private $config;

	/**
	* Database connection (PDO)
	*
	* @var \PDO
	*/
	protected $conn;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @param array          $config
	 * @param \PDO           $conn
	 * @param UserManager	 $user_manager
	 */
	public function __construct(
		array $config,
		\PDO $conn,
		UserManager $user_manager
	) {
		$this->config = $config;
		$this->conn = $conn;
		$this->userManager = $user_manager;
	}

	/**
	 * Validate email activation request.
	 * Activate email address.
	 *
	 * @param  User	  $user		User who requested activation
	 * @param  string $token	Authentication token
	 *
	 * @return array 	Error flag, code and message
	 */
	public function activateEmail($user, $token)
	{
		$return = array(
			'err' => true,
			'code' => 0,
			'msg' => ''
		);

		/* Validate email activation request */

		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['email_requesting_activation_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$user->getID()]);

		//	User not found
		if ($stmt->rowCount() == 0) {
			$return['code'] = self::USER_NOT_FOUND;
			$return['msg'] = $this->config['msg']['user_not_found'];

			return $return;
		}

		$record = $stmt->fetch();

		//	Token not match
		if (!hash_equals($record['token'], $token)) {
			$return['code'] = self::TOKEN_NOT_MATCH;
			$return['msg'] = $this->config['msg']['token_not_match'];

			return $return;
		}

		//	Request expired
		if (strtotime($record['expn_dt']) < time()) {
			$stmt = $this->conn->prepare(
				"DELETE FROM {$this->config['email_requesting_activation_table']}
				WHERE id = ?"
			);
			$stmt->execute([$record['id']]);

			$return['code'] = self::REQUEST_EXPIRED;
			$return['msg'] = $this->config['msg']['request_expired'];

			return $return;
		}

		/* Activate email */

		$params = array(
			'is_verified' => true,
			'email' => $record['email']
		);
		$this->userManager->updateRecord($record['user_id'], $params);

		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['email_requesting_activation_table']}
			WHERE email = ?"
		);
		$stmt->execute([$record['email']]);

		//	Successfully activated
		$return['err'] = false;

		return $return;
	}
}
