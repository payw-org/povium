<?php
/**
 * Sql for creating auto_saved_post table.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

return [
	'sql' => '
		CREATE TABLE IF NOT EXISTS auto_saved_post (
  			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL,
			contents JSON NOT NULL,
			body MEDIUMTEXT NOT NULL,
			is_premium BOOLEAN NOT NULL,
			creation_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_edited_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			title VARCHAR(120),
			subtitle VARCHAR(160),
			thumbnail VARCHAR(511),
			series_id INT(11) UNSIGNED,
			post_id INT(11) UNSIGNED UNIQUE,
			CONSTRAINT FK__user__auto_saved_post FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__series__auto_saved_post FOREIGN KEY (series_id)
			REFERENCES series (id) ON DELETE SET NULL ON UPDATE CASCADE,
			CONSTRAINT FK__post__auto_saved_post FOREIGN KEY (post_id)
			REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE
    	
	  	) ENGINE=InnoDB DEFAULT CHARSET=utf8
	'
];
