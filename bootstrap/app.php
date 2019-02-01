<?php
/**
 * Bootstrap the app.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

use Readigm\Base\Factory\MasterFactory;

$factory = new MasterFactory();

/* Bootstrap the app services */

$app['db_builder'] = $factory->createInstance(
	\Readigm\Provider\DBServiceProvider::class
)->boot();

$app['session_manager'] = $factory->createInstance(
	\Readigm\Provider\SessionServiceProvider::class
)->boot();

$app['authenticator'] = $factory->createInstance(
	\Readigm\Provider\AuthServiceProvider::class
)->boot();

$app['blade'] = $factory->createInstance(
	\Readigm\Provider\TemplateServiceProvider::class
)->boot();

$app['router'] = $factory->createInstance(
	\Readigm\Provider\RouteServiceProvider::class,
	$app['blade'],
	$app['authenticator']
)->boot();

return $app;
