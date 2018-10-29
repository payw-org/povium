<?php
/**
* Config array for "DBBuilder".
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_comment_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_connected_user_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_email_requesting_activation_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_membership_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_post_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_post_tag_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_post_topic_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_series_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_session_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_tag_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_topic_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_user_table.php');
require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/create_autosaved_post_table.php');

return [
	'dbname' => 'povium_local_db',

	'table_list' => [
		new CreateCommentTable(),
		new CreateConnectedUserTable(),
		new CreateEmailRequestingActivation(),
		new CreateMembershipTable(),
		new CreatePostTable(),
		new CreatePostTagTable(),
		new CreatePostTopicTable(),
		new CreateSeriesTable(),
		new CreateSessionTable(),
		new CreateTagTable(),
		new CreateTopicTable(),
		new CreateUserTable(),
		new CreateAutosavedPostTable()
	]
];
