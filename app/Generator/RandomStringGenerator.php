<?php
/**
* Random string generator.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Generator;

class RandomStringGenerator
{
	/**
	* @param  int $len Length of the random string
	*
	* @return string
	*/
	public function generateRandomString($len)
	{
		return substr(bin2hex(random_bytes($len)), 0, $len);
	}

	/**
	 * Generate a version 4 (random) UUID (Universal Unique IDentifier)
	 * UUID format : 8-4-4-4-12
	 *
	 * @return string
	 */
	public function generateUUIDV4()
	{
		$data = random_bytes(16);
		$data[6] = chr(ord($data[6]) & 0x0f | 0x40); 	// set version to 0100
		$data[8] = chr(ord($data[8]) & 0x3f | 0x80); 	// set bits 6-7 to 10

		return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
	}
}
