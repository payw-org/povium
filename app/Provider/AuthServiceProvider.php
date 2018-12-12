<?php
/**
 * Bootstrap authentication or authorization services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Povium\Base\Factory\MasterFactory;
use Povium\Security\Auth\Authenticator;
use Povium\Security\Auth\Authorizer;

class AuthServiceProvider implements ServiceProviderInterface
{
	/**
	 * @var MasterFactory
	 */
	protected $factory;

	/**
	 * @param MasterFactory $factory
	 */
	public function __construct(MasterFactory $factory)
	{
		$this->factory = $factory;
	}

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
