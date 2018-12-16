<?php
/**
 * Validate post title.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Validator\PostInfo;

use Povium\Validator\ValidatorInterface;

class TitleValidator implements ValidatorInterface
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
	 * @param string $title
	 *
	 * @return array 	Error flag and message
	 */
	public function validate($title)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if (empty($title)) {
			$return['msg'] = $this->config['msg']['title_empty'];

			return $return;
		}

		if (mb_strlen($title) > $this->config['len']['title_max_length']) {
			$return['msg'] = $this->config['msg']['title_long'];

			return $return;
		}

		$return['err'] = false;

		return $return;
	}
}
