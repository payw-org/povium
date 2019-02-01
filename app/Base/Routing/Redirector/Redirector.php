<?php
/**
* Responsible for redirect.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Base\Routing\Redirector;

class Redirector implements RedirectorInterface
{
	/**
	 * {@inheritdoc}
	 */
	public function redirect($uri, $return_to = false, $return_uri = "")
	{
		$location = BASE_URI . $uri;

		if (!$return_to) {				//	Simple redirect
			$http_response_code = 301;
		} else {						//	Back after
			$http_response_code = 302;

			if (empty($return_uri)) {	//	Back to current URI
				$return_uri = BASE_URI . $_SERVER['REQUEST_URI'];
			} else {					//	Back to other URI
				$return_uri = BASE_URI . $return_uri;
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
}
