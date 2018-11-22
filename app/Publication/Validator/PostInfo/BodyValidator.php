<?php
/**
 * Validate post body.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Validator\PostInfo;

use Povium\Validator\ValidatorInterface;

class BodyValidator implements ValidatorInterface
{
	/**
	 * @var array
	 */
	protected $config;

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
	 * @param string $body
	 *
	 * @return array 	Error flag and message
	 */
	public function validate($body)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($body)) {
			$return['msg'] = $this->config['msg']['body_empty'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}
}
