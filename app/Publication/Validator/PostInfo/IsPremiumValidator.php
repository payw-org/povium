<?php
/**
 * Validate premium setting for post.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Publication\Validator\PostInfo;

use Povium\Security\Authorization\Authorizer;
use Povium\Validator\ValidatorInterface;

class IsPremiumValidator implements ValidatorInterface
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
	 * @param bool $is_premium
	 *
	 * @return array 	Error flag and message
	 */
	public function validate($is_premium)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		if ($is_premium) {
			if ($GLOBALS['authority'] < Authorizer::PRO_EDITOR) {
				$return['msg'] = $this->config['msg']['only_for_pro'];

				return $return;
			}
		}

		$return['err'] = false;

		return $return;
	}
}
