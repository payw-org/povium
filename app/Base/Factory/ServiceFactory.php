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

class ServiceFactory extends AbstractChildFactory
{
	/**
	* Manufacture materials into arguments
	*
	* @param mixed optional
	*
	* @return void
	*/
	protected function prepareArgs()
	{
		$materials = func_get_args();

		//	Prepare arguments for each type
		$args = array();
		switch ($this->type) {
			//	Auth constructor params
			//	(\PDO) : Not given
			//	(SessionManager) : Given
			case '\Povium\Auth':
				$args[] = DBConnection::getInstance()->getConn();
				$args[] = $materials[0];

				break;

			//	ActivationMailSender constructor params
			//	(PHPMailer) : Not given
			case '\Povium\MailSender\ActivationMailSender':
				$args[] = new PHPMailer(true);

				break;

			//	SessionManager constructor params
			//	(\PDO) : Not given
			case '\Povium\Base\Session\SessionManager':
				$args[] = DBConnection::getInstance()->getConn();

				break;

			//	Redirector constructor params
			//	(string) : Given
			case '\Povium\Base\Routing\Redirector':
				$args[] = $materials[0];

				break;
		}

		$this->args = $args;
	}
}
