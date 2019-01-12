<?php
/**
 * Sql for creating post_tag table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS post_tag (
			post_id INT(11) UNSIGNED NOT NULL,
			tag_id INT(11) UNSIGNED NOT NULL,
			PRIMARY KEY (post_id, tag_id),
			CONSTRAINT FK__post__post_tag FOREIGN KEY (post_id)
			REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__tag__post_tag FOREIGN KEY (tag_id)
			REFERENCES tag (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
