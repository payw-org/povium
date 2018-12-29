<?php
/**
* This factory is responsible for creating "ActivationMailSender" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\MailSender\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use PHPMailer\PHPMailer\PHPMailer;

class ActivationMailSenderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$mail = new PHPMailer(true);
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/mail_sender.php');

		$this->args[] = $mail;
		$this->args[] = $config;
	}
}
