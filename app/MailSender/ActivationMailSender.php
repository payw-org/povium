<?php
/**
* This mail sender send email to activate user email address.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\MailSender;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class ActivationMailSender extends AbstractMailSender
{
	/**
	 * Generate activation email for new email address.
	 *
	 * @param  string $recipient		Email address
	 * @param  string $activation_link
	 *
	 * @throws Exception
	 */
	protected function generateEmail()
	{
		//	Get required arguments
		$args = func_get_args();
		$recipient = $args[0];
		$activation_link = $args[1];

		//	Set sender
		$this->mail->setFrom(
			$this->config['activation_mail']['from_email'],
			$this->config['activation_mail']['from_name']
		);

		//	Set recipient
		$this->mail->addAddress($recipient);

		//	Set content
		$this->mail->isHTML(true);
		$this->mail->Subject = $this->config['activation_mail']['mail_subject'];
		$this->mail->Body = $this->config['activation_mail']['mail_body'] . $activation_link;
		$this->mail->AltBody = $this->config['activation_mail']['mail_altbody'];
	}
}
