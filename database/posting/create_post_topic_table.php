<?php
/**
* Junction table for post table and topic table.
* Store topics for each post.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE post_topic (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	post_id INT(11) UNSIGNED NOT NULL,
	topic_id SMALLINT(6) UNSIGNED NOT NULL,
	CONSTRAINT FK__post__post_topic FOREIGN KEY (post_id)
	REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FK__topic__post_topic FOREIGN KEY (topic_id)
	REFERENCES topic (id) ON DELETE RESTRICT ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
