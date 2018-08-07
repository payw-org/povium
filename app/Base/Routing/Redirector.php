<?php
/**
* Responsible for redirect.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Routing;

class Redirector
{
	/**
	 * @var string
	 */
	private $baseURI;

	/**
	 * @param string $baseURI
	 */
	public function __construct($baseURI)
	{
		$this->baseURI = $baseURI;
	}

	/**
	 * Redirect to given URI.
	 * If $return_to is true, add 'redirect' query.
	 * For redirect back after login (or register, etc...).
	 * If you want to back other URI, you can specify it through $return_uri.
	 *
	 * @param  string  $uri
	 * @param  boolean $return_to
	 * @param  string  $return_uri
	 *
	 * @return void
	 */
	public function redirect($uri, $return_to = false, $return_uri = "")
	{
		$location = $this->baseURI . $uri;
		$http_response_code = 302;		//	Default value

		if (!$return_to) {				//	Simple redirect
			$http_response_code = 301;
		} else {						//	Back after
			$http_response_code = 302;

			if (empty($return_uri)) {	//	Back to current URI
				$return_uri = $this->baseURI . $_SERVER['REQUEST_URI'];
			} else {					//	Back to other URI
				$return_uri = $this->baseURI . $return_uri;
			}

			//	Add return uri to query.
			$location .=
				(parse_url($location, PHP_URL_QUERY) ? '&' : '?') .
 				http_build_query(array('redirect' => $return_uri));
		}

		header(
			'Location: ' . $location,
 			true,
 			$http_response_code
		);

		exit();
	}

	/**
	 * @param  string $redirect_uri
	 *
	 * @return boolean
	 */
	public function verifyRedirectURI($redirect_uri)
	{
		$parsed_base_uri = parse_url($this->baseURI);
		$parsed_redirect_uri = parse_url($redirect_uri);

		//	Check URI scheme
		if ($parsed_redirect_uri['scheme'] !== $parsed_base_uri['scheme']) {
			return false;
		}

		//	Check URI host
		if ($parsed_redirect_uri['host'] !== $parsed_base_uri['host']) {
			return false;
		}

		return true;
	}
}
