<?php
/**
 * Middleware for profile view.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\User;

use Povium\Base\Http\Exception\NotFoundHttpException;
use Povium\Http\Middleware\AbstractViewMiddleware;
use Povium\Security\User\UserManager;

class ProfileViewMiddleware extends AbstractViewMiddleware
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

		$this->viewConfig = array(
			'user' => null
		);
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param string $readable_id
	 */
	public function requestView()
	{
		$args = func_get_args();
		$readable_id = $args[0];

		$readable_id = strtolower($readable_id);

		$user_id = $this->userManager->getUserIDFromReadableID($readable_id);

		if ($user_id === false) {
			throw new NotFoundHttpException();
		}

		$user = $this->userManager->getUser($user_id);

		$this->viewConfig['user'] = array(
			'name' => $user->getName(),
			'profile_image' => $user->getProfileImage(),
			'bio' => $user->getBio()
		);

		//	@TODO: Load view config
	}
}
