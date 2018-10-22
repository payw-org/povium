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

		$json_array = json_decode($subtitle, true);
		if (json_last_error() !== JSON_ERROR_NONE) {
			$return['msg'] = $this->config['msg']['subtitle_invalid'];

			return $return;
		}

		//	Only extract plain text from json
		ob_start();
		array_walk_recursive(
			$json_array,
			function ($value, $key) {
				if ($key == "data") {
					echo $value;
				}
			}
		);
		$subtitle_string = ob_get_clean();

		if (mb_strlen($subtitle_string) > $this->config['len']['subtitle_max_length']) {
			$return['msg'] = $this->config['msg']['subtitle_long'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}
}
