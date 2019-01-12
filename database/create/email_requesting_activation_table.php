<?php
/**
 * Sql for creating email_requesting_activation table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS email_requesting_activation (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL UNIQUE,
			email VARCHAR(254) NOT NULL,
			token CHAR(36) NOT NULL UNIQUE,
			expn_dt DATETIME NOT NULL,
			CONSTRAINT FK__user__email_requesting_activation FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
