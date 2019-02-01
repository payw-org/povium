<?php
/**
 * Sql for creating session table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS session (
			id CHAR(64) PRIMARY KEY,
			data TEXT,
			creation_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			touched_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
