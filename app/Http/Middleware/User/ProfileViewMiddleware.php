<?php
/**
 * Middleware for profile view.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Http\Middleware\User;

use Readigm\Base\Http\Exception\NotFoundHttpException;
use Readigm\Http\Controller\Exception\UserNotFoundException;
use Readigm\Http\Controller\User\ProfileViewController;
use Readigm\Http\Middleware\AbstractViewMiddleware;

class ProfileViewMiddleware extends AbstractViewMiddleware
{
	/**
	 * @var ProfileViewController
	 */
	protected $profileViewController;

	/**
	 * @param ProfileViewController $profile_view_controller
	 */
	public function __construct(ProfileViewController $profile_view_controller)
	{
		$this->profileViewController = $profile_view_controller;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param string $readable_id
	 *
	 * @throws NotFoundHttpException	If the readable id of user is not found
	 */
	public function requestViewConfig()
	{
		$args = func_get_args();
		$readable_id = $args[0];

		$readable_id = strtolower($readable_id);

		try {
			return $this->profileViewController->loadViewConfig($readable_id);
		} catch (UserNotFoundException $e) {
			throw new NotFoundHttpException(
				$e->getMessage(),
				$e->getCode(),
				$e
			);
		}
	}
}
