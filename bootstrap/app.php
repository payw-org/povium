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
	\Povium\Provider\DBServiceProvider::class
)->boot();

$app['session_manager'] = $factory->createInstance(
	\Povium\Provider\SessionServiceProvider::class
)->boot();

$app['authenticator'] = $factory->createInstance(
	\Povium\Provider\AuthServiceProvider::class
)->boot();

$app['blade'] = $factory->createInstance(
	\Povium\Provider\TemplateServiceProvider::class
)->boot();

$app['router'] = $factory->createInstance(
	\Povium\Provider\RouteServiceProvider::class,
	$app['blade'],
	$app['authenticator']
)->boot();

return $app;
