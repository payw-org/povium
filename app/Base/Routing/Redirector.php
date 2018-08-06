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
	 * If $returnTo is true, add 'redirect' query.
	 * For redirect back after login (or register, etc...).
	 * If you want to back other URI, you can specify it through $returnURI.
	 *
	 * @param  string  $uri
	 * @param  boolean $returnTo
	 * @param  string  $returnURI
	 *
	 * @return void
	 */
	public function redirect($uri, $returnTo = false, $returnURI = "")
	{
		$location = $this->baseURI . $uri;
		$http_response_code = 302;		//	Default value

		if (!$returnTo) {				//	Simple redirect
			$http_response_code = 301;
		} else {						//	Back after
			$http_response_code = 302;

			if (empty($returnURI)) {	//	Back to current URI
				$returnURI = $this->baseURI . $_SERVER['REQUEST_URI'];
			} else {					//	Back to other URI
				$returnURI = $this->baseURI . $returnURI;
			}

			//	Add return uri to query.
			$location .=
				(parse_url($location, PHP_URL_QUERY) ? '&' : '?') .
 				http_build_query(array('redirect' => $returnURI));
		}

		header(
			'Location: ' . $location,
 			true,
 			$http_response_code
		);

		exit();
	}

	/**
	 * @param  string $redirectURI
	 *
	 * @return boolean
	 */
	public function verifyRedirectURI($redirectURI)
	{
		$parsed_base_uri = parse_url($this->baseURI);
		$parsed_redirect_uri = parse_url($redirectURI);

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
