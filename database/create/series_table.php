<?php
/**
 * Sql for creating series table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS series (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL,
			title VARCHAR(200) NOT NULL,
			publication_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_edited_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			description VARCHAR(500),
			thumbnail VARCHAR(511),
			CONSTRAINT FK__user__series FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
