<?php
/**
* Interface for redirector.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Base\Routing\Redirector;

interface RedirectorInterface
{
	/**
	 * Redirect to given URI.
	 * If $return_to is true, add 'redirect' query.
	 * For redirect back after login (or register, etc...).
	 * If you want to back other URI, you can specify it through "$return_uri" parameter.
	 *
	 * @param  string  $uri			URI to redirect
	 * @param  boolean $return_to	Redirect back after?
	 * @param  string  $return_uri	URI to redirect back after
	 */
	public function redirect($uri, $return_to = false, $return_uri = "");
}
