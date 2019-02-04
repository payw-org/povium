<?php
/**
 * Controller for loading config of profile view page.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

namespace Povium\Http\Controller\User;

use Povium\Http\Controller\StandardViewController;
use Povium\Http\Controller\Exception\UserNotFoundException;
use Povium\Loader\Module\Globals\GlobalNavigationModuleLoader;
use Povium\Loader\Module\Profile\ProfileInfoModuleLoader;
use Povium\Security\User\UserManager;

class ProfileViewController extends StandardViewController
{
	/**
	 * @var ProfileInfoModuleLoader
	 */
	protected $profileInfoModuleLoader;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param GlobalNavigationModuleLoader 	$global_navigation_module_loader
	 * @param ProfileInfoModuleLoader 		$profile_info_module_loader
	 * @param UserManager 					$user_manager
	 * @param array 						$config
	 */
	public function __construct(
		GlobalNavigationModuleLoader $global_navigation_module_loader,
		ProfileInfoModuleLoader $profile_info_module_loader,
		UserManager $user_manager,
		array $config
	) {
		parent::__construct($global_navigation_module_loader);
		$this->profileInfoModuleLoader = $profile_info_module_loader;
		$this->userManager = $user_manager;
		$this->config = $config;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param string $readable_id
	 *
	 * @throws UserNotFoundException	If user is not found
	 */
	public function loadViewConfig()
	{
		parent::loadViewConfig();

		$args = func_get_args();
		$readable_id = $args[0];

		$user_id = $this->userManager->getUserIDFromReadableID($readable_id);

		//	User not found
		if ($user_id === false) {
			throw new UserNotFoundException($this->config['msg']['user_not_found']);
		}

		$this->viewConfig['profile_info'] = $this->profileInfoModuleLoader->loadData($user_id);

		return $this->viewConfig;
	}
}
