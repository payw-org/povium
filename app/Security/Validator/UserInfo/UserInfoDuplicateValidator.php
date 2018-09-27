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
use Povium\Security\User\UserProvider;

abstract class UserInfoDuplicateValidator implements ValidatorInterface, DuplicateCheckerInterface
{
	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @var UserProvider
	 */
	protected $userProvider;

	/**
	 * @param array 		$config
	 * @param UserProvider	$user_provider
	 */
	public function __construct(array $config, UserProvider $user_provider)
	{
		$this->config = $config;
		$this->userProvider = $user_provider;
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
