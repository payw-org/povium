<?php
/**
* Password encoder
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Encoder;

class PasswordEncoder implements PasswordEncoderInterface
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param array $config 
	 */
	public function __construct(array $config)
	{
		$this->config = $config;
	}

	/**
	 * {@inheritdoc}
	 */
	public function encode($password)
	{
		$encoded_password = password_hash(
			$password,
 			$this->config['password_encoding_algo'],
 			$this->config['password_encoding_options']
		);

		return $encoded_password;
	}

	/**
	* {@inheritdoc}
	*/
	public function verifyAndReEncode($raw_password, $encoded_password)
	{
		$return = array(
			'is_verified' => false,
			'new_encoded' => ''
		);

		if (!password_verify($raw_password, $encoded_password)) {
			return $return;
		}

		$return['is_verified'] = true;

		if (password_needs_rehash(
			$encoded_password,
 			$this->config['password_encoding_algo'],
 			$this->config['password_encoding_options']
		)) {
			$return['new_encoded'] = $this->encode($raw_password);
		}

		return $return;
	}
}
