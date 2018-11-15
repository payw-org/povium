<?php
/**
 * Middleware for user profile page.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

use Povium\Base\Http\Exception\NotFoundHttpException;

global $factory;

$user_manager = $factory->createInstance('\Povium\Security\User\UserManager');

if (false === $user_id = $user_manager->getUserIDFromReadableID($readable_id)) {
	throw new NotFoundHttpException();
}

$user = $user_manager->getUser($user_id);
