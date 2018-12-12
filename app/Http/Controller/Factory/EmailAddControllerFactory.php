<?php
/**
* This factory is responsible for creating "EmailAddController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Database\DBConnection;
use Povium\Security\Validator\UserInfo\EmailValidator;

class EmailAddControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_add_controller.php');
		$conn = DBConnection::getInstance()->getConn();
		$email_validator = $factory->createInstance(EmailValidator::class);

		$this->args[] = $config;
		$this->args[] = $conn;
		$this->args[] = $email_validator;
	}
}
