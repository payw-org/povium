<?php
/**
 * Extract plain text from json array.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

namespace Readigm\Http\Controller\Extractor;

class TextExtractor implements ExtractorInterface
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param array $config
	 */
	public function __construct(array $config)
	{
		$this->config = $config;
	}

	/**
	 * {@inheritdoc}
	 *
	 * Extract plain text recursively.
	 *
	 * @return string	Plain text
	 */
	public function extract($array)
	{
		$text = '';

		foreach ($array as $key => $value) {
			if (is_array($value)) {
				if (
					isset($value[$this->config['property']['type']]) &&
					$value[$this->config['property']['type']] == $this->config['value']['type']['plain_text']
				) {
					$text .= $value[$this->config['property']['data']];
				} else {
					//	Search for next depth
					$text .= $this->extract($value);
				}
			}
		}

		return $text;
	}
}
