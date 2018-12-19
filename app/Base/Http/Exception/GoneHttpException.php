<?php
/**
 * Http exception for 410 Gone.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Base\Http\Exception;

class GoneHttpException extends HttpException
{
	/**
	 * {@inheritdoc}
	 */
	public function __construct($message = "", $code = 0, $previous = null)
 	{
		parent::__construct(410, $message, $code, $previous);
	}
}
