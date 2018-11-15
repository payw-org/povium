<?php
/**
* Validate redirect URI.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Routing\Validator;

use Povium\Validator\ValidatorInterface;

class RedirectURIValidator implements ValidatorInterface
{
	/**
	 * {@inheritdoc}
	 *
	 * @return bool	Is validate?
	 */
	public function validate($redirect_uri)
	{
		//	Check if value is a valid URL form
		if (!filter_var($redirect_uri, FILTER_VALIDATE_URL)) {
			return false;
		}

		$parsed_base_uri = parse_url(BASE_URI);
		$parsed_redirect_uri = parse_url($redirect_uri);

		//	Check URI scheme
		if ($parsed_redirect_uri['scheme'] !== $parsed_base_uri['scheme']) {
			return false;
		}

		//	Check URI host
		$parsed_redirect_uri['host'] = preg_replace('/^www./', '', $parsed_redirect_uri['host']);
		if ($parsed_redirect_uri['host'] !== $parsed_base_uri['host']) {
			return false;
		}

		return true;
	}
}
