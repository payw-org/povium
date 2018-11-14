<?php
/**
* This factory is responsible for creating "EmailAddController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Database\DBConnection;

class EmailAddControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_add_controller.php');
		$conn = DBConnection::getInstance()->getConn();
		$email_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\EmailValidator');

		$this->args = array(
			$config,
			$conn,
			$email_validator
		);
	}
}