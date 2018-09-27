<?php
/**
* Interface for Validator.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Validator;

interface ValidatorInterface
{
	/**
	* Validate the input.
	*
	* @param mixed $input
	*/
	public function validate($input);
}
