<?php
/**
* Junction table for post table and tag table.
* Store tags for each post.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE post_tag (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	post_id INT(11) UNSIGNED NOT NULL,
	tag_id INT(11) UNSIGNED NOT NULL,
	CONSTRAINT FK__post__post_tag FOREIGN KEY (post_id)
	REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FK__tag__post_tag FOREIGN KEY (tag_id)
	REFERENCES tag (id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
