<?php
/**
 * Bootstrap authentication or authorization services.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Provider;

use Povium\Security\Auth\Authenticator;
use Povium\Security\Auth\Authorizer;

class AuthServiceProvider extends AbstractServiceProvider
{
	/**
	 * {@inheritdoc}
	 */
	public function boot()
	{
		$authenticator = $this->factory->createInstance(Authenticator::class);
		$authorizer = $this->factory->createInstance(Authorizer::class, $authenticator);

		//	Set current auth state to global.
		$GLOBALS['is_logged_in'] = $authenticator->isLoggedIn();
		$GLOBALS['current_user'] = $authenticator->getCurrentUser();
		$GLOBALS['authority'] = $authorizer->getAuthority();

		return $authenticator;
	}
}
