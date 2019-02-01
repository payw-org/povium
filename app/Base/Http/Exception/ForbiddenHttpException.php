<?php
/**
 * Http exception for 403 Forbidden.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Base\Http\Exception;

class ForbiddenHttpException extends HttpException
{
	/**
	 * {@inheritdoc}
	 */
	public function __construct($message = "", $code = 0, $previous = null)
 	{
		parent::__construct(403, $message, $code, $previous);
	}
}
