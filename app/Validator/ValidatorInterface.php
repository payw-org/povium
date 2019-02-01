<?php
/**
* Interface for validator.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Validator;

interface ValidatorInterface
{
	/**
	* Validate the input.
	*
	* @param mixed $input
	*/
	public function validate($input);
}
