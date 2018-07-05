<?php
/**
* A single route.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium\Base;

class Route {
	/**
	 * One of a HTTP methods
	 * GET : READ
	 * POST : CREATE
	 * PUT : UPDATE
	 * DELETE : DELETE
	 * @var string
	 */
	public $http_method;


	/**
	 * URI pattern with regular expressions.
	 * @var string
	 */
	public $pattern;


	/**
	 * @var callback
	 */
	public $handler;


	/**
	 * @param string $http_method
	 * @param string $pattern
	 * @param callback $handler
	 */
	public function __construct ($http_method, $pattern, $handler) {
		$this->http_method = strtoupper($http_method);
		$this->pattern = $pattern;
		$this->handler = $handler;
	}


	// /**
	//  * Check if a given Request URI is matched the pattern.
	//  * @param  string  $request_uri
	//  * @return bool
	//  */
	// public function checkMatch ($request_uri) {
	//
	// }


	// /**
	//  * @param  [type] $request_uri [description]
	//  * @return [type]              [description]
	//  */
	// public function handle ($request_uri) {
	//
	// }
}


?>
