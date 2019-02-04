<?php
/**
* Validate user's readable id.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Security\Validator\UserInfo;

use Povium\Security\User\UserManager;

class ReadableIDValidator extends UserInfoDuplicateValidator
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
	 * @param string $readable_id
	 */
	public function validate($readable_id, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($readable_id)) {
			$return['msg'] = $this->config['msg']['readable_id_empty'];

			return $return;
		}

		if (!preg_match($this->config['regex']['readable_id_regex_base'], $readable_id)) {
			$return['msg'] = $this->config['msg']['readable_id_invalid'];

			return $return;
		}

		if (strlen($readable_id) < (int)$this->config['len']['readable_id_min_length']) {
			$return['msg'] = $this->config['msg']['readable_id_short'];

			return $return;
		}

		if (strlen($readable_id) > (int)$this->config['len']['readable_id_max_length']) {
			$return['msg'] = $this->config['msg']['readable_id_long'];

			return $return;
		}

		if (preg_match($this->config['regex']['readable_id_regex_banned_1'], $readable_id)) {
			$return['msg'] = $this->config['msg']['readable_id_both_ends_illegal'];

			return $return;
		}

		if (preg_match($this->config['regex']['readable_id_regex_banned_2'], $readable_id)) {
			$return['msg'] = $this->config['msg']['readable_id_continuous_underscore'];

			return $return;
		}

		if ($duplicate_check) {
			if ($this->isAlreadyTaken($readable_id)) {
				$return['msg'] = $this->config['msg']['readable_id_is_taken'];

				return $return;
			}
		}

		$return['err'] = false;

		return $return;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param string $readable_id
	 */
	public function isAlreadyTaken($readable_id)
	{
		if (false === $this->userManager->getUserIDFromReadableID($readable_id)) {
			return false;
		}

		return true;
	}
}
