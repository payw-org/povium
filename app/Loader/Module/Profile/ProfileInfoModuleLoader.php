<?php
/**
 * Loader for data in profile info module.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

namespace Povium\Loader\Module\Profile;

use Povium\Loader\Module\ModuleLoaderInterface;
use Povium\Security\User\UserManager;

class ProfileInfoModuleLoader implements ModuleLoaderInterface
{
	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @param UserManager $user_manager
	 */
	public function __construct(UserManager $user_manager)
	{
		$this->userManager = $user_manager;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param int	$user_id
	 */
	public function loadData()
	{
		$args = func_get_args();
		$user_id = $args[0];

		$data = array();

		$user = $this->userManager->getUser($user_id);

		$data['name'] = $user->getName();
		$data['profile_image'] = $user->getProfileImage();
		$data['bio'] = $user->getBio();

		return $data;
	}
}
