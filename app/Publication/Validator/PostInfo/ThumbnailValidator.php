<?php
/**
 * Validate post thumbnail file path.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Validator\PostInfo;

use Povium\Validator\ValidatorInterface;

class ThumbnailValidator implements ValidatorInterface
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
	public function validate($thumbnail)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($thumbnail)) {
			$return['msg'] = $this->config['msg']['thumbnail_empty'];

			return $return;
		}

		// @TODO Check if it is a valid thumbnail path
		// (Check directory, file extension and file exists)

		$return['err'] = false;

		return $return;
	}
}
