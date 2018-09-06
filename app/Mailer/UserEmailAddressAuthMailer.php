<?php
/**
* This mailer send email to authenticate user email address.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Mailer;

class UserEmailAddressAuthMailer extends AbstractMailer
{
	/**
	 * Generate email to authenticate user email address.
	 *
	 * @param  string $recipient Email address
	 * @param  string $auth_uri  URI for email authentication
	 *
	 * @throws Exception
	 */
	protected function generateEmail()
	{
		//	Get required arguments
		$args = func_get_args();
		$recipient = $args[0];
		$auth_uri = $args[1];

		//	Set sender
		$this->mail->setFrom(
			$this->config['settings_for_email_auth']['from_email'],
			$this->config['settings_for_email_auth']['from_name']
		);

		//	Set recipient
		$this->mail->addAddress($recipient);

		//	Set content
		$this->mail->isHTML(true);
		$this->mail->Subject = $this->config['settings_for_email_auth']['mail_subject'];
		$this->mail->Body = $this->config['settings_for_email_auth']['mail_body'] . $auth_uri;
		$this->mail->AltBody = $this->config['settings_for_email_auth']['mail_altbody'];
	}
}
