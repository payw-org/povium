<?php
/**
 * Validate series setting for post.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Publication\Validator\PostInfo;

use Readigm\Validator\ValidatorInterface;

class SeriesIDValidator implements ValidatorInterface
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
	 *
	 * @param int $series_id
	 * @param int $user_id
	 *
	 * @return array 	Error flag and message
	 */
	public function validate($series_id)
	{
		$user_id = func_get_arg(1);

		$return = array(
			'err' => true,
			'msg' => ''
		);

		// @TODO: Check if the user's series

		$return['err'] = false;

		return $return;
	}
}
