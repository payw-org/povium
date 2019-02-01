<?php
/**
 * Sql for creating topic table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS topic (
			id SMALLINT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(32) NOT NULL UNIQUE,
			description VARCHAR(250) NOT NULL,
			registration_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
