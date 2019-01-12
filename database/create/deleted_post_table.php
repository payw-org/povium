<?php
/**
 * Sql for creating deleted_post table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS deleted_post (
			id INT(11) UNSIGNED PRIMARY KEY,
			deleted_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
