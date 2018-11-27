<?php
/**
* Controller for email activation.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Http\Controller\Authentication;

use Povium\Http\Controller\Exception\RequestExpiredException;
use Povium\Http\Controller\Exception\RequestNotFoundException;
use Povium\Http\Controller\Exception\TokenNotMatchedException;
use Povium\Security\User\UserManager;
use Povium\Security\User\User;

class EmailActivationController
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
	 * @return array 	Error flag and message
	 */
	public function activateEmail($user, $token)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		/* Validate email activation request */

		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['email_requesting_activation_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$user->getID()]);

		//	Request not found
		if ($stmt->rowCount() == 0) {
			throw new RequestNotFoundException($this->config['msg']['request_not_found']);
		}

		$record = $stmt->fetch();

		//	Token not matched
		if (!hash_equals($record['token'], $token)) {
			throw new TokenNotMatchedException($this->config['msg']['token_not_matched']);
		}

		//	Request expired
		if (strtotime($record['expn_dt']) < time()) {
			$stmt = $this->conn->prepare(
				"DELETE FROM {$this->config['email_requesting_activation_table']}
				WHERE id = ?"
			);
			$stmt->execute([$record['id']]);

			throw new RequestExpiredException($this->config['msg']['request_expired']);
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
