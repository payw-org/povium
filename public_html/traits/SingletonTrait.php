<?php

/**
* Trait SingletonTrait
* Trait for singleton pattern
*
* @author fairyhooni
* @license MIT
*
*/

namespace povium;


trait SingletonTrait {
	private static $instance = NULL;

	/**
	* [getInstance description]
	* call this method to get instance
	* @return object static instance
	*/
	public static function getInstance(){
		if(static::$instance === NULL){
			static::$instance = new static();
		}
		return static::$instance;
	}


	/**
	* [__construct description]
	* private to prevent creating multiple instance
	*/
	private function __construct(){
	}


	/**
	* [__clone description]
	* private to prevent clonning
	*/
	private function __clone(){
	}


}


?>
