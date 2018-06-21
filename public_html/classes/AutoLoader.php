<?php

/**
* Class AutoLoader
* Custom AutoLoader class for povium directory
*
* @author fairyhooni
* @license MIT
*
*/

namespace pvm;


class AutoLoader {
	private static $dirs = array(
		'classes',
		'traits',
	);


	public static function register() {
		spl_autoload_register(array(__CLASS__, 'loader'));
	}

	public static function unregister() {
		spl_autoload_unregister(array(__CLASS__, 'loader'));
	}


	private static function loader($name) {
		//	convert to filename
		$name = ltrim($name, '\\');
		$fileName  = '';
		$namespace = '';
		if ($lastNsPos = strrpos($name, '\\')) {
			$namespace = substr($name, 0, $lastNsPos);
			$name = substr($name, $lastNsPos + 1);
			$fileName  = str_replace('\\', DIRECTORY_SEPARATOR, $namespace) . DIRECTORY_SEPARATOR;
		}
		$fileName .= str_replace('_', DIRECTORY_SEPARATOR, $name) . '.php';

		//	check each dirs
		foreach(self::$dirs as $value){
			$reformedName = str_replace('pvm', $value, $fileName);
			if(file_exists($reformedName)) {
				require $reformedName;
			}
		}

	}


}

?>
