<?php
/**
 * Http exception for 404 Not Found.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Http\Exception;

class NotFoundHttpException extends HttpException
{
	/**
	 * @param string  		$details	Http response details
	 * @param int 			$code		Error code
	 * @param \Throwable 	$previous	Previous exception
	 */
	public function __construct($details = "", $code = 0, $previous = null)
 	{
		parent::__construct(404, $details, $code, $previous);
	}
}
