<?php
/**
* Config array for mailer
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

return [
	'use_smtp' => false,					//	Set mailer to use SMTP
	'smtp_debug' => 0,						//	Enable verbose debug output
	'smtp_host' => 'smtp.gmail.com',		//	Specify main and backup SMTP servers
	'smtp_auth' => true,					//	Enable SMTP authentication
	'smtp_username' => 'pro1000j@gmail.com',//	SMTP username
	'smtp_password' => '',		//	SMTP password
	'smtp_secure' => 'tls',					//	Enable TLS encryption, `ssl` also accepted
	'smtp_port' => 587,						//	TCP port to connect to

	'mail_charset' => 'UTF-8',

	'settings_for_email_auth' => [
		'from_email' => 'noreply@povium.com',
		'from_name' => 'Povium',

		'mail_subject' => '[Povium] 이메일을 인증해주세요.',
		'mail_body' => '인증링크: ',
		'mail_altbody' => ''
	]
];
