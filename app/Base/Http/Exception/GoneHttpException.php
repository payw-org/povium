<?php
/**
 * Http exception for 410 Not Found.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Http\Exception;

class GoneHttpException extends HttpException
{
	/**
	 * @param string  		$details	Http response details
	 * @param int 			$code		Error code
	 * @param \Throwable 	$previous	Previous exception
	 */
	public function __construct($details = "", $code = 0, $previous = null)
 	{
		parent::__construct(410, $details, $code, $previous);
	}
}
