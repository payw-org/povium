<?php
/**
* Manage sending mail.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var PHPMailer
	 */
	private $mail;

	/**
	 * Constructor
	 */
	public function __construct()
	{
		$this->config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/mailer.php');
		$this->mail = new PHPMailer(true);
	}

	/**
	 * @param  string $recipient Email address
	 * @param  string $auth_uri  URI for email authentication
	 * @return boolean           Whether email is sent
	 */
	public function sendEmailForEmailAuth($recipient, $auth_uri)
	{
		try {
			//	Server settings
			if ($this->config['use_smtp']) {
				//	Enable verbose debug output
				if ($this->config['smtp_debug']) {
					$this->mail->SMTPDebug = $this->config['smtp_debug'];
				}

				$this->mail->isSMTP();
				$this->mail->Host = $this->config['smtp_host'];

				//	Set SMTP account
				$this->mail->SMTPAuth = $this->config['smtp_auth'];
				if ($this->config['smtp_auth']) {
					$this->mail->Username = $this->config['smtp_username'];
					$this->mail->Password = $this->config['smtp_password'];
				}

				$this->mail->SMTPSecure = $this->config['smtp_secure'];
				$this->mail->Port = $this->config['smtp_port'];
			}

			$this->mail->CharSet = $this->config['mail_charset'];

			//	Recipients
			$this->mail->setFrom(
				$this->config['settings_for_email_auth']['from_email'],
				$this->config['settings_for_email_auth']['from_name']
			);
			$this->mail->addAddress($recipient);

			//	Content
			$this->mail->isHTML(true);
			$this->mail->Subject = $this->config['settings_for_email_auth']['mail_subject'];
			$this->mail->Body = $this->config['settings_for_email_auth']['mail_body'] . $auth_uri;
			$this->mail->AltBody = $this->config['settings_for_email_auth']['mail_altbody'];

			//	Finally, send email.
			$this->mail->send();
		} catch (Exception $e) {		//	Mail could not be sent
			error_log('Mailer Error: ' . $this->mail->ErrorInfo);

			return false;
		}

		return true;
	}
}
