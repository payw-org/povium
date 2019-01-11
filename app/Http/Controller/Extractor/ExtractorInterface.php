<?php
/**
 * Interface for json extractor.
 * Given json array must follow the RDM contents format.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Http\Controller\Extractor;

interface ExtractorInterface
{
	/**
	 * Extract data from json array.
	 *
	 * @param array	$array	Json array
	 */
	public function extract($array);
}
