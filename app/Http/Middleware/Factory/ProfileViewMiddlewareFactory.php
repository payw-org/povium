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

class ProfileViewMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$profile_view_controller = $master_factory->createInstance('\Povium\Http\Controller\User\ProfileViewController');

		$this->args = array(
			$profile_view_controller
		);
	}
}
