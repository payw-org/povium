<?php
/**
 * Http exception for 403 Forbidden.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Http\Exception;

class ForbiddenHttpException extends HttpException
{
	/**
	 * @param string  		$details	Http response details
	 * @param int 			$code		Exception code
	 * @param \Throwable 	$previous	Previous exception
	 */
	public function __construct($details = "", $code = 0, $previous = null)
 	{
		parent::__construct(403, $details, $code, $previous);
	}
}
