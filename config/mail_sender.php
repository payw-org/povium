<?php
/**
* Config array for mail sender
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

return [
	'use_smtp' => false,					//	Set to use SMTP
	'smtp_debug' => 0,						//	Enable verbose debug output
	'smtp_host' => 'smtp.gmail.com',		//	Specify main and backup SMTP servers
	'smtp_auth' => true,					//	Enable SMTP authentication
	'smtp_username' => 'pro1000j@gmail.com',//	SMTP username
	'smtp_password' => '',		//	SMTP password
	'smtp_secure' => 'tls',					//	Enable TLS encryption, `ssl` also accepted
	'smtp_port' => 587,						//	TCP port to connect to

	'mail_charset' => 'UTF-8',

	'activation_mail' => [
		'from_email' => 'noreply@readigm.com',
		'from_name' => 'Readigm',

		'mail_subject' => '[Readigm] 이메일을 인증해주세요.',
		'mail_body' => '인증링크: ',
		'mail_altbody' => ''
	]
];
