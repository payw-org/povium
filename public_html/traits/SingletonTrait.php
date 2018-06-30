<?php
/**
* Trait for singleton pattern
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
* @license MIT
*
*/


namespace povium;


trait SingletonTrait {
	private static $instance = NULL;

	/**
	* Only one instance is generated.
	* @return object static instance
	*/
	public static function getInstance () {
		if (static::$instance === NULL) {
			static::$instance = new static();
		}
		return static::$instance;
	}


	/**
	* Constructor is private to prevent creating multiple instance
	*/
	private function __construct () {
	}


	/**
	* This function is private to prevent clonning
	*/
	private function __clone () {
	}


}


?>
