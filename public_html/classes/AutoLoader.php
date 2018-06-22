<?php

/**
* Class AutoLoader
* Custom AutoLoader class
*
* @author fairyhooni
* @license MIT
*
*/

namespace povium;


class AutoLoader {
	/**
	* An associative array where the key is a namespace prefix and the value
	* is an array of base directories for classes in that namespace.
	*
	* @var array
	*/
	private $prefixes;


	/**
	*
	* Set prefixes and base directories for povium directory
	*/
	public function __construct() {
		$this->addNamespace('povium', 'classes');
		$this->addNamespace('povium', 'traits');
	}


	/**
	* Register loader with SPL autoloader stack
	*
	* @return void
	*/
	public function register() {
		spl_autoload_register(array($this, 'loader'));
	}


	/**
	* Unregister loader
	*
	* @return void
	*/
	public function unregister() {
		spl_autoload_unregister(array($this, 'loader'));
	}


	/**
	* Adds a base directory for a namespace prefix.
	*
	* @param string $prefix The namespace prefix.
	* @param string $base_dir A base directory for class files in the
	* namespace.
	* @param bool $prepend If true, prepend the base directory to the stack
	* instead of appending it; this causes it to be searched first rather
	* than last.
	* @return void
	*/
	public function addNamespace($prefix, $base_dir, $prepend=false) {
		// normalize namespace prefix
		$prefix = ltrim($prefix, '\\');
		$prefix = str_replace('\\', '/', $prefix);

		// normalize the base directory with a trailing separator
		$base_dir = rtrim($base_dir, '/');

		// initialize the namespace prefix array
		if (isset($this->prefixes[$prefix]) === false) {
			$this->prefixes[$prefix] = array();
		}

		// retain the base directory for the namespace prefix
		if ($prepend) {
			array_unshift($this->prefixes[$prefix], $base_dir);
		} else {
			array_push($this->prefixes[$prefix], $base_dir);
		}
	}


	/**
	* Loads the class file for a given class name.
	*
	* @param  string $classname Classname
	* @return mixed Boolean false if no mapped file can be loaded, or the
	* name of the mapped file that was loaded.
	*/
	private function loader($classname) {
		//	convert classname to filename
		$classname = ltrim($classname, '\\');
		$filename = str_replace('\\', '/', $classname) . '.php';

		//	look through base directories for each prefixes
		foreach($this->prefixes as $prefix => $base_dirs){
			//	if prefix match,
			if(strpos($filename, $prefix . '/') === 0){
				foreach($base_dirs as $dir) {
					$newFilename = substr_replace($filename, $dir, 0, strlen($prefix));

					//	if the mapped file exists, require it
					//	and return file name
					if($this->requireFile($newFilename)) {
						return $newFilename;
					}
				}

				return false;
			}
		}

	}


	/**
	* If a file exists, require it from the file system.
	*
	* @param string $file The file to require.
	* @return bool True if the file exists, false if not.
	*/
	private function requireFile($file) {
		if (file_exists($file)) {
			require $file;
			return true;
		}
		return false;
	}


}

?>
