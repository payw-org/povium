<?php

class TemplateEngine {

	private $config = [];

	/**
	 * Render templates with variable set.
	 * @param  string  $template_dir  Template file written in phtml.
	 * @param  array   $config        "name" => value
	 * @return null                   Return nothing
	 */
	public function render ($template_dir, $config) {

		$this->config = $config;

		include $template_dir;

	}

	/**
	 * If
	 * @param  string $str String or file location to be included.
	 * @return [type]      [description]
	 */
	public function embrace ($str) {
		$opt = $this->config[$str];
		if (isset($opt)) {
			if (file_exists($opt)) {
				include_once $opt;
			} else {
				echo $opt;
			}
		}
	}

	public function isConfigSet ($config_name) {
		isset($var[$config_name]) ? true : false;
	}

	public function getConfig ($config_name) {
		return $this->config[$config_name];
	}

	public function basis ($config_name, $str) {
		if (($this->isConfigSet("head_meta") && $this->getConfig("head_meta")) || !($this->isConfigSet("head_meta"))) {
			$this->embrace($str);
		}
	}
}

?>
