<?php
/**
* This factory is responsible for creating "LogoutController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Http\Session\SessionManager;
use Povium\Security\Auth\Authenticator;

class LogoutControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Authenticator
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();
		$factory = new MasterFactory();

		$session_manager = $factory->createInstance(SessionManager::class);
		$authenticator = $materials[0];

		$this->args[] = $session_manager;
		$this->args[] = $authenticator;
	}
}
