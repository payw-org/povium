<?php
/**
 * Sql for creating membership table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS membership (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL UNIQUE,
			expn_dt DATETIME NOT NULL,
			CONSTRAINT FK__user__membership FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
