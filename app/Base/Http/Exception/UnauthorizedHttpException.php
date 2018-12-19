<?php
/**
 * Http exception for 401 Unauthorized.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Base\Http\Exception;

class UnauthorizedHttpException extends HttpException
{
	/**
	 * {@inheritdoc}
	 */
	public function __construct($message = "", $code = 0, $previous = null)
	{
		parent::__construct(401, $message, $code, $previous);
	}
}
