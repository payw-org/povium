<?php
/**
* This factory is responsible for creating "LogoutController" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Http\Session\SessionManager;
use Readigm\Security\Auth\Authenticator;

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

		$authenticator = $materials[0];
		$session_manager = $factory->createInstance(SessionManager::class);

		$this->args[] = $authenticator;
		$this->args[] = $session_manager;
	}
}
