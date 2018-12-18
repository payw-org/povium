<?php
/**
 * Middleware for home view.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Home;

use Povium\Http\Controller\Home\HomeViewController;
use Povium\Http\Middleware\AbstractViewMiddleware;

class HomeViewMiddleware extends AbstractViewMiddleware
{
	/**
	 * @var HomeViewController
	 */
	protected $homeViewController;

	/**
	 * @param HomeViewController $home_view_controller
	 */
	public function __construct(HomeViewController $home_view_controller)
	{
		$this->homeViewController = $home_view_controller;
	}

	/**
	 * {@inheritdoc}
	 */
	public function requestViewConfig()
	{
		return $this->homeViewController->loadViewConfig();
	}
}
