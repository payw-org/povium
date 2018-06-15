<?php

class TemplateEngine {

	private $config = [];

	/**
	 * Render templates with config array.
	 * @param  string  $template_dir  Template file written in phtml.
	 * @param  array   $config        "name" => value
	 * @return null                   Return nothing
	 */
	public function render ($template_dir, $config, $is_root = false) {

		if (is_array($config)) {
			$this->config = $config;
		} else {
			trigger_error("Config is not an array", E_USER_ERROR);
		}

		if (is_file(getcwd() . "/" . $template_dir)) {
			include getcwd() . "/" . $template_dir;
		} else if (is_file($_SERVER['DOCUMENT_ROOT'] . $template_dir)) {
			include $_SERVER['DOCUMENT_ROOT'] . $template_dir;
		} else {
			trigger_error("File not exist", E_USER_ERROR);
		}

	}

	/**
	 * Include string or a file in directory.
	 * @param  string $str Config name
	 * @return null   Return nothing
	 */
	public function embrace ($config_name) {

		if ($this->isConfigSet($config_name)) {

			if (is_file(getcwd() . "/" . $this->getConfig($config_name))) {

				include_once getcwd() . "/" . $this->getConfig($config_name);

			} else if ($this->getConfig($config_name)[0] == "/") {

				if (is_file($_SERVER['DOCUMENT_ROOT'] . $this->getConfig($config_name))) {
					include_once $_SERVER['DOCUMENT_ROOT'] . $this->getConfig($config_name);
				}

			} else {

				echo $this->getConfig($config_name);

			}

		} else {
			echo $config_name;
		}

	}

	public function isConfigSet ($config_name) {
		if (isset($this->config[$config_name])) {
			return true;
		} else {
			false;
		}
	}

	public function getConfig ($config_name) {
		return $this->config[$config_name];
	}

	public function setConfig ($config_name, $new) {
		$this->config[$config_name] = $new;
	}

	/**
	 * This function automatically includes the template without config. To avoid including the template, set the confing to false.
	 * @param  string  $config_name
	 * @param  string  $str
	 * @param  boolean $is_root     [description]
	 * @return boolean              [description]
	 */
	public function basis ($config_name, $dir) {
		if (($this->isConfigSet($config_name) && $this->getConfig($config_name)) || !($this->isConfigSet($config_name))) {
			$this->setConfig($config_name, $dir);
			$this->embrace($config_name);
		}
	}

}

?>
