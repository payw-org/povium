<?php
/**
 * Bootstrap template services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Povium\Base\Factory\MasterFactory;
use Povium\Security\User\User;

class TemplateServiceProvider implements ServiceProviderInterface
{
	/**
	 * @var MasterFactory
	 */
	protected $factory;

	/**
	 * @var User|false
	 */
	protected $currentUser;

	/**
	 * @param MasterFactory $factory
	 * @param User|false 	$current_user
	 */
	public function __construct(
		MasterFactory $factory,
		$current_user
	) {
		$this->factory = $factory;
		$this->currentUser = $current_user;
	}

	/**
	 * {@inheritdoc}
	 */
	public function boot()
	{
		$blade = $this->factory->createInstance('\Philo\Blade\Blade');
		$blade->view()->share('current_user', $this->currentUser);

		return $blade;
	}
}
