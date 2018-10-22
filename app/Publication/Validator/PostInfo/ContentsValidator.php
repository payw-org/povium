<?php
/**
 * Validate post contents.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Validator\PostInfo;

use Povium\Validator\ValidatorInterface;

class ContentsValidator implements ValidatorInterface
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
	 * @return array 	Error flag and message
	 */
	public function validate($contents)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($contents)) {
			$return['msg'] = $this->config['msg']['contents_empty'];

			return $return;
		}

		json_decode($contents);
		if (json_last_error() !== JSON_ERROR_NONE) {
			$return['msg'] = $this->config['msg']['contents_invalid'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}
}
