<?php
/**
 * Extract elements from json array for post contents.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

namespace Readigm\Http\Controller\Extractor;

class ContentsExtractor implements ExtractorInterface
{
	/**
	 * @var TextExtractor
	 */
	protected $textExtractor;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param TextExtractor $text_extractor
	 * @param array 		$config
	 */
	public function __construct(TextExtractor $text_extractor, array $config)
	{
		$this->textExtractor = $text_extractor;
		$this->config = $config;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param array $contents	Json array for post contents
	 *
	 * @return array	Elements
	 */
	public function extract($contents)
	{
		$elements = array(
			'body' => ''
		);

		foreach ($contents as $node) {
			if (isset($node[$this->config['property']['role']])) {
				switch ($node[$this->config['property']['role']]) {
					case $this->config['value']['role']['title']:
						$elements['title'] = trim($this->textExtractor->extract($node[$this->config['property']['data']]));

						break;
					case $this->config['value']['role']['subtitle']:
						$elements['subtitle'] = trim($this->textExtractor->extract($node[$this->config['property']['data']]));

						break;
					case $this->config['value']['role']['thumbnail']:
						$elements['thumbnail'] = $node[$this->config['property']['url']];

						break;
				}
			}

			if ($node[$this->config['property']['type']] == $this->config['value']['type']['image']) {
				$elements['images'][] = $node[$this->config['property']['url']];
			}

			//	Concatenate with whitespace for separating each paragraph.
			$elements['body'] .= trim($this->textExtractor->extract($node)) . ' ';
		}

		$elements['body'] = trim($elements['body']);

		return $elements;
	}
}
