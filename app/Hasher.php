<?php
/**
* Hash manager.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium;

class Hasher
{
	/**
	* @param  int $len Length of random hash (real length is $len * 2)
	*
	* @return string
	*/
	public static function generateRandomHash($len)
	{
		return bin2hex(openssl_random_pseudo_bytes($len));
	}

	/**
	 * Generate a version 4 (random) UUID(Universal Unique IDentifier)
	 * UUID format : 8-4-4-4-12
	 *
	 * @return string uuid
	 */
	public static function uuidV4()
	{
		$data = openssl_random_pseudo_bytes(16);
	    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); 	// set version to 0100
	    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); 	// set bits 6-7 to 10

	    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
	}
}
