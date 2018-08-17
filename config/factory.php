<?php
/**
* Mapping class type to responsible factory
* $key : Fully qualified class name
* $value : Fully qualified factory name
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'\Povium\Base\Factory\ServiceFactory' => [
		'\Povium\Auth',
		'\Povium\Mailer\UserEmailAddressAuthMailer',
		'\Povium\Base\Routing\Router',
		'\Povium\Base\Routing\Redirector'
	]
];
