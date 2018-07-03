<?php
/**
* Load template files and configuration.
* And renders the view.
*
* @author J.Haemin
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium\Base\View;

class TemplateEngine {

	private $config = [];

	/**
	 * Render templates with config array.
	 * @param  string  $template_dir  Template file written in phtml.
	 * @param  array   $config        "name" => value
	 * @return null                   Return nothing
	 */
	public function render ($template_dir, $config) {

		if (is_array($config)) {

			$this->config = $config;

		} else {

			trigger_error("Config is not an array", E_USER_ERROR);

		}

		if (is_file(getcwd() . "/" . $template_dir)) {

			require_once getcwd() . "/" . $template_dir;

		} else if (is_file($_SERVER['DOCUMENT_ROOT'] . "/.." . $template_dir)) {

			require_once $_SERVER['DOCUMENT_ROOT'] . "/.." . $template_dir;

		} else {

			echo $template_dir;

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

				require_once getcwd() . "/" . $this->getConfig($config_name);

			} else if ($this->getConfig($config_name)[0] == "/") {

				if (is_file($_SERVER['DOCUMENT_ROOT'] . "/.." . $this->getConfig($config_name))) {

					require_once $_SERVER['DOCUMENT_ROOT'] . "/.." . $this->getConfig($config_name);

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
	 * This function automatically includes the template without config set to true. To avoid including the template, set the config to false.
	 * @param  string  $config_name  Config Name
	 * @param  string  $dir          Directory
	 * @return null                  Return Nothing
	 */
	public function basis ($config_name, $dir, $config = []) {

		if (($this->isConfigSet($config_name) && $this->getConfig($config_name)) || !($this->isConfigSet($config_name))) {

			// $this->setConfig($config_name, $dir);
			// $this->embrace($config_name);
			$te = new TemplateEngine();
			$te->render($dir, $config);

		}

	}

	/**
	 * If there is no config, do nothing.
	 * @param  string $config_name
	 */
	public function optional ($config_name) {
		if ($this->isConfigSet($config_name)) {
			$this->embrace($config_name);
		} else {
			return;
		}
	}

}

?>
