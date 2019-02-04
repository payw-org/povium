<?php
/**
 * Validate premium setting for post.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Publication\Validator\PostInfo;

use Povium\Security\Auth\Authorizer;
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
	 * @param bool 	$is_premium
	 * @param int	$authority
	 *
	 * @return array 	Error flag and message
	 */
	public function validate($is_premium)
	{
		$authority = func_get_arg(1);

		$return = array(
			'err' => true,
			'msg' => ''
		);

		if ($is_premium) {
			if ($authority < Authorizer::PRO_EDITOR) {
				$return['msg'] = $this->config['msg']['only_for_pro'];

				return $return;
			}
		}

		$return['err'] = false;

		return $return;
	}
}
