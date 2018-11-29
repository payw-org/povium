<?php
/**
* This factory is responsible for creating "Authenticator" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Database\DBConnection;

class AuthenticatorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/authenticator.php');
		$conn = DBConnection::getInstance()->getConn();
		$random_string_generator = $factory->createInstance('\Povium\Generator\RandomStringGenerator');
		$client = $factory->createInstance('\Povium\Base\Http\Client');
		$user_manager = $factory->createInstance('\Povium\Security\User\UserManager');
		$session_manager = $factory->createInstance('\Povium\Base\Http\Session\SessionManager');

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
