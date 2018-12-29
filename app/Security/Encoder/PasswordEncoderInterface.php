<?php
/**
* Interface for password encoder
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Security\Encoder;

interface PasswordEncoderInterface
{
	/**
	 * Encode raw password.
	 *
	 * @param  string $password	Raw password
	 *
	 * @return string	Encoded password
	 */
	public function encode($password);

	/**
	 * Verify raw password and re-encode if encoding options are changed.
	 *
	 * @param  string 	$raw_password
	 * @param  string 	$encoded_password
	 *
	 * @return array 	Is verified flag and re-encoded password
	 * 					if encoding options are changed
	 */
	public function verifyAndReEncode($raw_password, $encoded_password);
}
