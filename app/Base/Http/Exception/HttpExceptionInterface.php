<?php
/**
 * Interface for Http error exceptions.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Http\Exception;

interface HttpExceptionInterface
{
	/**
	 * Gets the http response code
	 *
	 * @return int
	 */
	public function getResponseCode();

	/**
	 * Gets the http response title
	 *
	 * @return string
	 */
	public function getTitle();

	/**
	 * Gets the http response message
	 *
	 * @return string
	 */
	public function getMsg();

	/**
	 * Gets the http response details
	 *
	 * @return string
	 */
	public function getDetails();
}
