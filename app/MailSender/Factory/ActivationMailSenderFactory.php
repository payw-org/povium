<?php
/**
* This factory is responsible for creating "ActivationMailSender" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\MailSender\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use PHPMailer\PHPMailer\PHPMailer;

class ActivationMailSenderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/mail_sender.php');
		$mail = new PHPMailer(true);

		$this->args = array(
			$config,
			$mail
		);
	}
}
