<?php
/**
 * Http exception for 404 Not Found.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Base\Http\Exception;

class NotFoundHttpException extends HttpException
{
	/**
	 * {@inheritdoc}
	 */
	public function __construct($message = "", $code = 0, $previous = null)
	{
		parent::__construct(404, $message, $code, $previous);
	}
}
