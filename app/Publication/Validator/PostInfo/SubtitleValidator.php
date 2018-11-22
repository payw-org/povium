<?php
/**
 * Validate post subtitle.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Validator\PostInfo;

use Povium\Validator\ValidatorInterface;

class SubtitleValidator implements ValidatorInterface
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
	 * @param string $subtitle
	 *
	 * @return array 	Error flag and message
	 */
	public function validate($subtitle)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($subtitle)) {
			$return['msg'] = $this->config['msg']['subtitle_empty'];

			return $return;
		}

		if (mb_strlen($subtitle) > $this->config['len']['subtitle_max_length']) {
			$return['msg'] = $this->config['msg']['subtitle_long'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}
}
