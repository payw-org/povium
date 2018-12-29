<?php
/**
* Controller for email activation.
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

namespace Readigm\Http\Controller\Authentication;

use Readigm\Http\Controller\Exception\RequestExpiredException;
use Readigm\Http\Controller\Exception\RequestNotFoundException;
use Readigm\Http\Controller\Exception\TokenNotMatchedException;
use Readigm\Security\User\UserManager;
use Readigm\Security\User\User;

class EmailActivationController
{
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
	 * @var array
	 */
	private $config;

	/**
	 * @param \PDO           $conn
	 * @param UserManager	 $user_manager
	 * @param array          $config
	 */
	public function __construct(
		\PDO $conn,
		UserManager $user_manager,
		array $config
	) {
		$this->conn = $conn;
		$this->userManager = $user_manager;
		$this->config = $config;
	}

	/**
	 * Validate email activation request.
	 * Activate email address.
	 *
	 * @param  User	  $user		User who requested activation
	 * @param  string $token	Authentication token
	 *
	 * @return array 	Error flag and message
	 *
	 * @throws RequestNotFoundException	If email activation request is not found
	 * @throws TokenNotMatchedException If token for authentication is not matched
	 * @throws RequestExpiredException	If email activation request is expired
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
