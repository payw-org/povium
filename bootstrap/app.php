<?php
/**
 * Bootstrap the app.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

use Povium\Base\Factory\MasterFactory;

$factory = new MasterFactory();

/* Bootstrap the app services */

$app['db_builder'] = $factory->createInstance(
	'\Povium\Provider\DBServiceProvider'
)->boot();

$app['session_manager'] = $factory->createInstance(
	'\Povium\Provider\SessionServiceProvider'
)->boot();

$app['authenticator'] = $factory->createInstance(
	'\Povium\Provider\AuthServiceProvider'
)->boot();

$app['blade'] = $factory->createInstance(
	'\Povium\Provider\TemplateServiceProvider',
	$app['authenticator']->getCurrentUser()
)->boot();

$app['router'] = $factory->createInstance(
	'\Povium\Provider\RouteServiceProvider',
	$app['authenticator'],
	$app['blade']
)->boot();

return $app;
