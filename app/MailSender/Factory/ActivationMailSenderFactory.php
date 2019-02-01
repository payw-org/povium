<?php
/**
* This factory is responsible for creating "ActivationMailSender" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
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
		$config = $this->configLoader->load('mail_sender');

		$this->args[] = $mail;
		$this->args[] = $config;
	}
}
