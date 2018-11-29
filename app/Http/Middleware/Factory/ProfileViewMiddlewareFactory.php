<?php
/**
 * This factory is responsible for creating "ProfileViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Http\Controller\User\ProfileViewController;

class ProfileViewMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$profile_view_controller = $factory->createInstance(ProfileViewController::class);

		$this->args = array(
			$profile_view_controller
		);
	}
}
