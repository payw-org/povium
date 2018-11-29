<?php
/**
 * Bootstrap authentication or authorization services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Povium\Base\Factory\MasterFactory;

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
		$authenticator = $this->factory->createInstance('\Povium\Security\Auth\Authenticator');

		$authorizer = $this->factory->createInstance('\Povium\Security\Auth\Authorizer', $authenticator);
		$authorizer->authorize();

		return $authenticator;
	}
}
