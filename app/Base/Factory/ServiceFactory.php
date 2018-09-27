<?php
/**
* This Factory is responsible for creating instance of type based on service.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Factory;

use Povium\Base\DBConnection;
use PHPMailer\PHPMailer\PHPMailer;
use ZxcvbnPhp\Zxcvbn;

class ServiceFactory extends AbstractChildFactory
{
	/**
	* {@inheritdoc}
	*/
	protected function prepareArgs()
	{
		$materials = func_get_args();

		//	Prepare arguments for each type
		$args = array();

		$master_factory = new MasterFactory();
		switch ($this->type) {
			case '\Povium\Base\Http\Session\PDOSessionHandler':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/session.php');
				$args[] = DBConnection::getInstance()->getConn();

				break;
			case '\Povium\Base\Http\Session\SessionManager':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/session.php');
				$args[] = DBConnection::getInstance()->getConn();
				$args[] = $master_factory->createInstance('\Povium\Base\Http\Session\PDOSessionHandler');

				break;
			case '\Povium\Base\Http\Client':
				break;
			case '\Povium\Base\Routing\Validator\RedirectURIValidator':
				break;
			case '\Povium\Base\Routing\Redirector':
				break;
			case '\Povium\Base\Routing\Router':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/http_response.php');

				break;
			case '\Povium\MailSender\ActivationMailSender':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/mail_sender.php');
				$args[] = new PHPMailer(true);

				break;
			case '\Povium\Generator\RandomStringGenerator':
				break;
			case '\Povium\Security\User\UserProvider':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/user_provider.php');
				$args[] = DBConnection::getInstance()->getConn();
				$args[] = $master_factory->createInstance('\Povium\Security\Encoder\PasswordEncoder');

				break;
			case '\Povium\Security\Encoder\PasswordEncoder':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/password_encoder.php');

				break;
			case '\Povium\Security\Validator\UserInfo\ReadableIDValidator':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/readable_id_validator.php');
				$args[] = $master_factory->createInstance('\Povium\Security\User\UserProvider');

				break;
			case '\Povium\Security\Validator\UserInfo\EmailValidator':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_validator.php');
				$args[] = $master_factory->createInstance('\Povium\Security\User\UserProvider');

				break;
			case '\Povium\Security\Validator\UserInfo\NameValidator':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/name_validator.php');
				$args[] = $master_factory->createInstance('\Povium\Security\User\UserProvider');

				break;
			case '\Povium\Security\Validator\UserInfo\PasswordValidator':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/password_validator.php');
				$args[] = new Zxcvbn();

				break;
			case '\Povium\Security\Auth\Auth':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php');
				$args[] = DBConnection::getInstance()->getConn();
				$args[] = $master_factory->createInstance('\Povium\Generator\RandomStringGenerator');
				$args[] = $master_factory->createInstance('\Povium\Base\Http\Client');
				$args[] = $master_factory->createInstance('\Povium\Security\User\UserProvider');
				$args[] = $materials[0];

				break;
			case '\Povium\Security\Auth\Controller\LoginController':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/login_controller.php');
				$args[] = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\ReadableIDValidator');
				$args[] = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\EmailValidator');
				$args[] = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\PasswordValidator');
				$args[] = $materials[0];

				break;
			case '\Povium\Security\Auth\Controller\LogoutController':
				$args[] = $materials[0];

				break;
			case '\Povium\Security\Auth\Controller\RegisterController':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/register_controller.php');
				$args[] = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\ReadableIDValidator');
				$args[] = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\NameValidator');
				$args[] = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\PasswordValidator');
				$args[] = $materials[0];

				break;
			case '\Povium\Security\Auth\Controller\EmailActivationController':
				$args[] = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_activation_controller.php');
				$args[] = DBConnection::getInstance()->getConn();
				$args[] = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\EmailValidator');
				$args[] = $materials[0];

				break;
		}

		$this->args = $args;
	}
}
