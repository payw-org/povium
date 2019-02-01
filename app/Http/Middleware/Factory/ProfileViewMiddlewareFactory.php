<?php
/**
 * This factory is responsible for creating "ProfileViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Http\Controller\User\ProfileViewController;

class ProfileViewMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$profile_view_controller = $factory->createInstance(ProfileViewController::class);

		$this->args[] = $profile_view_controller;
	}
}
