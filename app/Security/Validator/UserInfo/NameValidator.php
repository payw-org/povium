<?php
/**
* Validate user's name.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Security\Validator\UserInfo;

use Readigm\Security\User\UserManager;

class NameValidator extends UserInfoDuplicateValidator
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
	 * @param string $name
	 */
	public function validate($name, $duplicate_check = false)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($name)) {
			$return['msg'] = $this->config['msg']['name_empty'];

			return $return;
		}

		if (!preg_match($this->config['regex']['name_regex_base'], $name)) {
			$return['msg'] = $this->config['msg']['name_invalid'];

			return $return;
		}

		if (mb_strlen($name) < (int)$this->config['len']['name_min_length']) {
			$return['msg'] = $this->config['msg']['name_short'];

			return $return;
		}

		if (mb_strlen($name) > (int)$this->config['len']['name_max_length']) {
			$return['msg'] = $this->config['msg']['name_long'];

			return $return;
		}

		if (preg_match($this->config['regex']['name_regex_banned_1'], $name)) {
			$return['msg'] = $this->config['msg']['name_both_ends_illegal'];

			return $return;
		}

		if (preg_match($this->config['regex']['name_regex_banned_2'], $name)) {
			$return['msg'] = $this->config['msg']['name_continuous_special_chars'];

			return $return;
		}

		if ($duplicate_check) {
			if ($this->isAlreadyTaken($name)) {
				$return['msg'] = $this->config['msg']['name_is_taken'];

				return $return;
			}
		}

		$return['err'] = false;

		return $return;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param string $name
	 */
	public function isAlreadyTaken($name)
	{
		if (false === $this->userManager->getUserIDFromName($name)) {
			return false;
		}

		return true;
	}
}
