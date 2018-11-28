<?php
/**
 * Middleware for profile view.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\User;

use Povium\Base\Http\Exception\NotFoundHttpException;
use Povium\Http\Controller\Exception\UserNotFoundException;
use Povium\Http\Controller\User\ProfileViewController;
use Povium\Http\Middleware\AbstractViewMiddleware;

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
	 */
	public function requestView()
	{
		$args = func_get_args();
		$readable_id = $args[0];

		$readable_id = strtolower($readable_id);

		try {
			$view_config = $this->profileViewController->loadViewConfig($readable_id);

			$this->viewConfig = $view_config;
		} catch (UserNotFoundException $e) {
			throw new NotFoundHttpException(
				$e->getMessage(),
				$e->getCode(),
				$e
			);
		}
	}
}
