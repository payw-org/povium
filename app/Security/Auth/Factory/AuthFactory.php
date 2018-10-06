<?php
/**
* This factory is responsible for creating "Auth" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\DBConnection;
use Povium\Base\Http\Session\SessionManager;

class AuthFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param SessionManager
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php');
		$conn = DBConnection::getInstance()->getConn();
		$random_string_generator = $master_factory->createInstance('\Povium\Generator\RandomStringGenerator');
		$client = $master_factory->createInstance('\Povium\Base\Http\Client');
		$user_manager = $master_factory->createInstance('\Povium\Security\User\UserManager');
		$session_manager = $materials[0];

		$this->args = array(
			$config,
			$conn,
			$random_string_generator,
			$client,
			$user_manager,
			$session_manager
		);
	}
}
