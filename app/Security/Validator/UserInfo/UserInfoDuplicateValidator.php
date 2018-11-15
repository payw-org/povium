<?php
/**
* Duplicate validator for user info.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Validator\UserInfo;

use Povium\Validator\ValidatorInterface;
use Povium\Validator\DuplicateCheckerInterface;
use Povium\Security\User\UserManager;

abstract class UserInfoDuplicateValidator implements ValidatorInterface, DuplicateCheckerInterface
{
	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @param array 		$config
	 * @param UserManager	$user_manager
	 */
	public function __construct(array $config, UserManager $user_manager)
	{
		$this->config = $config;
		$this->userManager = $user_manager;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param	bool	$duplicate_check	Check duplicate?
	 *
	 * @return array 	Error flag and message
	 */
	abstract public function validate($input, $duplicate_check = false);
}
