<?php
/**
* Interface for Duplicate checker.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Validator;

interface DuplicateCheckerInterface
{
	/**
	 * Duplicate check.
	 *
	 * @param mixed	$input
	 *
	 * @return bool
	 */
	public function isAlreadyTaken($input);
}
