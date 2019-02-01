<?php
/**
* Manage client who is visited by browser.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Base\Http;

class Client
{
	/**
	 * IP address
	 *
	 * @var string
	 */
	private $ip;

	/**
	 * Client agent
	 *
	 * @var string
	 */
	private $agent;

	/**
	 * Get client ip address.
	 *
	 * @return string
	 */
	public function getIP()
	{
		if ($this->ip === null) {
			if (getenv('HTTP_CLIENT_IP')) {
				$ip = getenv('HTTP_CLIENT_IP');
			} else if (getenv('HTTP_X_FORWARDED_FOR')) {
			  	$ip = getenv('HTTP_X_FORWARDED_FOR');
		   	} else if (getenv('HTTP_X_FORWARDED')) {
			   	$ip = getenv('HTTP_X_FORWARDED');
		   	} else if (getenv('HTTP_FORWARDED_FOR')) {
			   	$ip = getenv('HTTP_FORWARDED_FOR');
		   	} else if (getenv('HTTP_FORWARDED')) {
			   	$ip = getenv('HTTP_FORWARDED');
		   	} else if (getenv('REMOTE_ADDR')) {
			   	$ip = getenv('REMOTE_ADDR');
		   	} else {
			   	$ip = "";
		   	}

			$this->ip = $ip;
		}

	    return $this->ip;
	}

	/**
	 * Get client agent.
	 *
	 * @return string
	 */
	public function getAgent()
	{
		if ($this->agent === null) {
			$this->agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";
		}

		return $this->agent;
	}
}
