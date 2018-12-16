<?php
/**
 * Controller for loading config of profile view.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\User;

use Povium\Http\Controller\Exception\UserNotFoundException;
use Povium\Loader\GlobalModule\GlobalNavigationLoader;
use Povium\Security\User\UserManager;

class ProfileViewController
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var GlobalNavigationLoader
	 */
	protected $globalNavigationLoader;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @param array 					$config
	 * @param GlobalNavigationLoader 	$global_navigation_loader
	 * @param UserManager 				$user_manager
	 */
	public function __construct(
		array $config,
		GlobalNavigationLoader $global_navigation_loader,
		UserManager $user_manager
	) {
		$this->config = $config;
		$this->globalNavigationLoader = $global_navigation_loader;
		$this->userManager = $user_manager;
	}

	/**
	 * Load config for profile view.
	 *
	 * @param string $readable_id
	 *
	 * @return array
	 *
	 * @throws UserNotFoundException	If user is not found
	 */
	public function loadViewConfig($readable_id)
	{
		$view_config = array();

		$user_id = $this->userManager->getUserIDFromReadableID($readable_id);

		//	User not found
		if ($user_id === false) {
			throw new UserNotFoundException($this->config['msg']['user_not_found']);
		}

		$view_config['global_nav'] = $this->globalNavigationLoader->loadData();

		$user = $this->userManager->getUser($user_id);

		$view_config['user'] = array(
			'name' => $user->getName(),
			'profile_image' => $user->getProfileImage(),
			'bio' => $user->getBio()
		);

		return $view_config;
	}
}
