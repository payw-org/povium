<?php
/**
* This factory is responsible for creating "EmailAddController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Database\DBConnection;
use Povium\Security\Auth\Auth;

class EmailAddControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Auth
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_add_controller.php');
		$conn = DBConnection::getInstance()->getConn();
		$email_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\EmailValidator');
 		$auth = $materials[0];

		$this->args = array(
			$config,
			$conn,
			$email_validator,
			$auth
		);
	}
}
