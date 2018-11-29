<?php
/**
 * Bootstrap route services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Philo\Blade\Blade;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\RouteCollection;
use Povium\Base\Routing\Router;
use Povium\Security\Auth\Authenticator;

class RouteServiceProvider implements ServiceProviderInterface
{
	/**
	 * @var MasterFactory
	 */
	protected $factory;

	/**
	 * @var Authenticator
	 */
	protected $authenticator;

	/**
	 * @var Blade
	 */
	protected $blade;

	/**
	 * @param MasterFactory $factory
	 * @param Authenticator $authenticator
	 * @param Blade 		$blade
	 */
	public function __construct(
		MasterFactory $factory,
		Authenticator $authenticator,
		Blade $blade
	) {
		$this->factory = $factory;
		$this->authenticator = $authenticator;
		$this->blade = $blade;
	}

	/**
	 * {@inheritdoc}
	 */
	public function boot()
	{
		$collection = $this->factory->createInstance(RouteCollection::class);

		$router = $this->factory->createInstance(Router::class);
		$factory = $this->factory;
		$authenticator = $this->authenticator;
		$blade = $this->blade;

		//	Create routes and register to collection.
		require($_SERVER['DOCUMENT_ROOT'] . '/../routes/web.php');

		$router->setRouteCollection($collection);

		return $router;
	}
}
