<?php
/**
 * Bootstrap route services.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Provider;

use Philo\Blade\Blade;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\RouteCollection;
use Povium\Base\Routing\Router;
use Povium\Security\Auth\Authenticator;

class RouteServiceProvider extends AbstractServiceProvider
{
	/**
	 * @var Blade
	 */
	protected $blade;

	/**
	 * @var Authenticator
	 */
	protected $authenticator;

	/**
	 * @param MasterFactory $factory
	 * @param Blade 		$blade
	 * @param Authenticator $authenticator
	 */
	public function __construct(
		MasterFactory $factory,
		Blade $blade,
		Authenticator $authenticator
	) {
		parent::__construct($factory);
		$this->blade = $blade;
		$this->authenticator = $authenticator;
	}

	/**
	 * {@inheritdoc}
	 */
	public function boot()
	{
		$router = $this->factory->createInstance(Router::class);
		$factory = $this->factory;
		$blade = $this->blade;
		$authenticator = $this->authenticator;

		$collection = $this->factory->createInstance(RouteCollection::class);

		//	Create routes and register to collection.
		require($_SERVER['DOCUMENT_ROOT'] . '/../routes/web.php');

		$router->setRouteCollection($collection);

		return $router;
	}
}
