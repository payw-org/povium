<?php
/**
 * Sql for creating post_topic table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS post_topic (
			post_id INT(11) UNSIGNED NOT NULL,
			topic_id SMALLINT(6) UNSIGNED NOT NULL,
			PRIMARY KEY (post_id, topic_id),
			CONSTRAINT FK__post__post_topic FOREIGN KEY (post_id)
			REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__topic__post_topic FOREIGN KEY (topic_id)
			REFERENCES topic (id) ON DELETE RESTRICT ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
