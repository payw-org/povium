<?php
/**
 * Middleware for http error view.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Error;

use Povium\Route\Middleware\AbstractViewMiddleware;

class HttpErrorViewMiddleware extends AbstractViewMiddleware
{
	public function __construct()
	{
		$this->viewConfig = array(
			'title'	=> null,
			'heading' => null,
			'details' => null
		);
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param	int		$response_code	Http response code
	 * @param	string	$title 			Http response title
	 * @param	string	$heading		Http response heading
	 * @param	string	$details		Http response details
	 */
	public function verifyViewRequest()
	{
		$args = func_get_args();
		$response_code = $args[0];
		$title = $args[1];
		$heading = $args[2];
		$details = $args[3];

		http_response_code($response_code);

		$this->viewConfig['title'] = $title;
		$this->viewConfig['heading'] = $heading;
		$this->viewConfig['details'] = $details;
	}
}
