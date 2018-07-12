<?php
/**
* Trait for singleton pattern
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium\Lib;

trait Singleton
{
	private static $instance = null;

	/**
	* Only one instance is generated.
	* @return object static instance
	*/
	public static function getInstance()
	{
		if (static::$instance === null) {
			static::$instance = new static();
		}

		return static::$instance;
	}

	/**
	* Constructor is private to prevent creating multiple instance
	*/
	private function __construct();

	/**
	* This function is private to prevent clonning
	*/
	private function __clone();

}
