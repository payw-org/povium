<?php
/**
 * Bootstrap session services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Povium\Base\Factory\MasterFactory;

class SessionServiceProvider implements ServiceProviderInterface
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
		$session_manager = $this->factory->createInstance('\Povium\Base\Http\Session\SessionManager');
		$session_manager->setSessionConfig();
		$session_manager->startSession();

		return $session_manager;
	}
}

