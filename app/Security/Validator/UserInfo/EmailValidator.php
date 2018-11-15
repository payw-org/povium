<?php
/**
* Validate user's email.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Validator\UserInfo;

class EmailValidator extends UserInfoDuplicateValidator
{
	/**
	 * {@inheritdoc}
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
	 */
	public function isAlreadyTaken($email)
	{
		if (false === $this->userManager->getUserIDFromEmail($email)) {
			return false;
		}

		return true;
	}
}
