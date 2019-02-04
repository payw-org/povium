<?php
/**
 * Http exception for 410 Gone.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Base\Http\Exception;

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
