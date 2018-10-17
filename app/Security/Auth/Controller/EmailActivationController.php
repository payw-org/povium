<?php
/**
* Control email activation.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Controller;

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
	 * @var Auth
	 */
	protected $auth;

	/**
	 * @param array          $config
	 * @param \PDO           $conn
	 * @param Auth           $auth
	 */
	public function __construct(
		array $config,
		\PDO $conn,
		Auth $auth
	) {
		$this->config = $config;
		$this->conn = $conn;
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
	 * Validate email activation request.
	 * Activate email address.
	 *
	 * @param  string $token
	 *
	 * @return array 	Error flag, code and message
	 */
	public function activateEmail($token)
	{
		$return = array(
			'err' => true,
			'code' => 0,
			'msg' => ''
		);

		/* Validate email activation request */

		//	Not logged in
		if (false === $this->auth->getCurrentUser()) {
			$return['code'] = $this->config['err']['not_logged_in']['code'];
			$return['msg'] = $this->config['err']['not_logged_in']['msg'];

			return $return;
		}

		$user_id = $this->auth->getCurrentUser()->getID();

		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['email_requesting_activation_table']}
			WHERE user_id = ?"
		);
		$stmt->execute([$user_id]);

		//	User not found
		if ($stmt->rowCount() == 0) {
			$return['code'] = $this->config['err']['user_not_found']['code'];
			$return['msg'] = $this->config['err']['user_not_found']['msg'];

			return $return;
		}

		$record = $stmt->fetch();

		//	Token not match
		if (!hash_equals($record['token'], $token)) {
			$return['code'] = $this->config['err']['token_not_match']['code'];
			$return['msg'] = $this->config['err']['token_not_match']['msg'];

			return $return;
		}

		//	Request expired
		if (strtotime($record['expn_dt']) < time()) {
			$stmt = $this->conn->prepare(
				"DELETE FROM {$this->config['email_requesting_activation_table']}
				WHERE id = ?"
			);
			$stmt->execute([$record['id']]);

			$return['code'] = $this->config['err']['request_expired']['code'];
			$return['msg'] = $this->config['err']['request_expired']['msg'];

			return $return;
		}

		/* Activate email */

		$params = array(
			'is_verified' => true,
			'email' => $record['email']
		);
		$this->auth->getUserManager()->updateUser($record['user_id'], $params);

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
