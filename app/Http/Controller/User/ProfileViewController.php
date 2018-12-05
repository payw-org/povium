<?php
/**
 * Controller for loading config of profile view.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\User;

use Povium\Http\Controller\Exception\UserNotFoundException;
use Povium\Security\User\UserManager;

class ProfileViewController
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @param array 		$config
	 * @param UserManager 	$user_manager
	 */
	public function __construct(
		array $config,
		UserManager $user_manager
	) {
		$this->config = $config;
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
		$user_id = $this->userManager->getUserIDFromReadableID($readable_id);

		//	User not found
		if ($user_id === false) {
			throw new UserNotFoundException($this->config['msg']['user_not_found']);
		}

		$user = $this->userManager->getUser($user_id);

		$view_config['user'] = array(
			'name' => $user->getName(),
			'profile_image' => $user->getProfileImage(),
			'bio' => $user->getBio()
		);

		return $view_config;
	}
}
