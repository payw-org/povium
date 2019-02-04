<?php
/**
* This is a RESTful based router.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Base\Routing;

use Povium\Base\Routing\Matcher\RequestMatcher;
use Povium\Base\Routing\Generator\URIGenerator;
use Povium\Base\Routing\Redirector\Redirector;
use Povium\Base\Routing\Exception\RouteNotFoundException;
use Povium\Base\Routing\Exception\MethodNotAllowedException;
use Povium\Base\Routing\Exception\NullPropertyException;
use Povium\Base\Http\Exception\HttpException;
use Povium\Base\Http\Exception\NotFoundHttpException;
use Povium\Base\Http\Exception\MethodNotAllowedHttpException;

class Router implements RouterInterface
{
	/**
	 * @var RequestMatcher
	 */
	protected $matcher;

	/**
	 * @var URIGenerator
	 */
	protected $generator;

	/**
	 * @var Redirector
	 */
	protected $redirector;

	/**
	 * @var RouteCollection
	 */
	protected $routeCollection;

	/**
	 * @param RequestMatcher $matcher
	 * @param URIGenerator   $generator
	 * @param Redirector     $redirector
	 */
	public function __construct(
		RequestMatcher $matcher,
		URIGenerator $generator,
		Redirector $redirector
	) {
		$this->matcher = $matcher;
		$this->generator = $generator;
		$this->redirector = $redirector;
	}

	/**
	 * @param RouteCollection $collection
	 */
	public function setRouteCollection(RouteCollection $collection)
 	{
 		$this->routeCollection = $collection;
		$this->matcher->setRouteCollection($collection);
		$this->generator->setRouteCollection($collection);
 	}

	/**
	 * {@inheritdoc}
	 */
	public function match($request_method, $request_uri)
	{
		return $this->matcher->match($request_method, $request_uri);
	}

	/**
	 * {@inheritdoc}
	 */
	public function generate($name, $params = array(), $form = self::PATH)
	{
		return $this->generator->generate($name, $params, $form);
	}

	/**
	 * {@inheritdoc}
	 */
	public function redirect($uri, $return_to = false, $return_uri = "")
	{
		$this->redirector->redirect($uri, $return_to, $return_uri);
	}

	/**
	 * {@inheritdoc}
	 */
	public function dispatch($request_method, $request_uri)
	{
		if ($this->routeCollection === null) {
			throw new NullPropertyException('Route collection property is null.');
		}

		//	Find a matched route.
		//	And call handler of the matched route.
		try {
			try{
				$matched_route_info = $this->matcher->match($request_method, $request_uri);

				$handler = $matched_route_info['handler'];
				$params = $matched_route_info['params'];

				$handler(...array_values($params));
			} catch (RouteNotFoundException $e) {
				throw new NotFoundHttpException(
					$e->getMessage(),
 					$e->getCode(),
 					$e
				);
			} catch (MethodNotAllowedException $e) {
				throw new MethodNotAllowedHttpException(
					$e->getMessage(),
 					$e->getCode(),
 					$e
				);
			}
		} catch (HttpException $e) {	//	Handle the http error
			$handler = $this->routeCollection->getRouteFromName('http_error')->getHandler();

			$handler($e);
		}
	}
}
