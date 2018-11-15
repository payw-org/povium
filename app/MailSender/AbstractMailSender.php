<?php
/**
* Manage sending mail.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\MailSender;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

abstract class AbstractMailSender
{
	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @var PHPMailer
	 */
	protected $mail;

	/**
	 * @param array     $config
	 * @param PHPMailer $mail
	 */
	public function __construct(array $config, PHPMailer $mail)
	{
		$this->config = $config;
		$this->mail = $mail;
	}

	/**
	 * Set basic email preferences
	 */
	protected function setBasicPreferences()
	{
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
	}

	/**
	 * Generate email according to purpose.
	 *
	 * @param	mixed	Arguments for sending email
	 *
	 * @throws Exception
	 */
	abstract protected function generateEmail();

	/**
	 * Send email.
	 *
	 * @param	mixed	Arguments for sending email
	 *
	 * @return	boolean	Whether email is sent
	 */
	public function sendEmail()
	{
		$this->setBasicPreferences();

		$args = func_get_args();

		try {
			$this->generateEmail(...$args);

			$this->mail->send();
		} catch (Exception $e) {		//	Mail could not be sent
			error_log('MailSender Error: ' . $this->mail->ErrorInfo);

			return false;
		}

		return true;
	}
}
