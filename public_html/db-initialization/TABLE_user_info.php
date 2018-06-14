<?php

/**
 * This code is not for executing.
 * @email
 * @column sub_stat 일정 간격으로 subs_expn_dt 값을 확인하며 auto update 시킨다.
 */
$sql = "CREATE TABLE user_info(
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user_id VARCHAR(40) NOT NULL UNIQUE,
	email VARCHAR(50) NOT NULL UNIQUE,
	user_pw VARCHAR(255) NOT NULL,
	nickname VARCHAR(40) NOT NULL UNIQUE,
	isactive BOOLEAN NOT NULL DEFAULT TRUE,
	last_login_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	reg_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	subs_stat BOOLEAN NOT NULL DEFAULT FALSE,
	subs_expn_dt DATETIME

) ENGINE=InnoDB DEFAULT CHARSET=utf8";

?>
