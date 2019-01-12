<?php
/**
 * Sql for creating tag table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS tag (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(64) NOT NULL UNIQUE,
			registration_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
