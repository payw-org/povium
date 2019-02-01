<?php
/**
* Validate user's email.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Security\Validator\UserInfo;

use Readigm\Security\User\UserManager;

class EmailValidator extends UserInfoDuplicateValidator
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param UserManager 	$user_manager
	 * @param array 		$config
	 */
	public function __construct(UserManager $user_manager, array $config)
	{
		parent::__construct($user_manager);
		$this->config = $config;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param string $email
	 */
	public function validate($email, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($email)) {
			$return['msg'] = $this->config['msg']['email_empty'];

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

		if ($duplicate_check) {
			if ($this->isAlreadyTaken($email)) {
				$return['msg'] = $this->config['msg']['email_is_taken'];

				return $return;
			}
		}

		$return['err'] = false;

		return $return;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param string $email
	 */
	public function isAlreadyTaken($email)
	{
		if (false === $this->userManager->getUserIDFromEmail($email)) {
			return false;
		}

		return true;
	}
}
