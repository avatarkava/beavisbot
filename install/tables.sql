DROP TABLE IF EXISTS `event_responses`;
CREATE TABLE `event_responses` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`event_type`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`trigger`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci ,
`response`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`is_active`  tinyint(1) NULL DEFAULT 0 ,
`created_at`  datetime NOT NULL ,
`updated_at`  datetime NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci

;

DROP TABLE IF EXISTS `karmas`;
CREATE TABLE `karmas` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`type`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`user_id`  int(10) UNSIGNED NOT NULL ,
`mod_user_id`  int(11) UNSIGNED NULL DEFAULT 0 ,
`details`  text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL ,
`created_at`  datetime NOT NULL ,
`updated_at`  datetime NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci

;

DROP TABLE IF EXISTS `plays`;
CREATE TABLE `plays` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`user_id`  int(10) UNSIGNED NOT NULL ,
`song_id`  int(11) UNSIGNED NOT NULL ,
`positive`  int(10) UNSIGNED NULL DEFAULT 0 ,
`negative`  int(10) UNSIGNED NULL DEFAULT 0 ,
`grabs`  int(10) UNSIGNED NULL DEFAULT 0 ,
`listeners`  int(10) UNSIGNED NULL DEFAULT 0 ,
`skipped`  int(10) UNSIGNED NULL DEFAULT 0 ,
`created_at`  datetime NOT NULL ,
`updated_at`  datetime NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci

;

DROP TABLE IF EXISTS `room_events`;
CREATE TABLE `room_events` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`type`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`title`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`slug`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`details`  text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL ,
`starts_at`  datetime NULL DEFAULT NULL ,
`ends_at`  datetime NULL DEFAULT NULL ,
`created_at`  datetime NOT NULL ,
`updated_at`  datetime NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci

;

DROP TABLE IF EXISTS `songs`;
CREATE TABLE `songs` (
`id`  int(10) UNSIGNED NOT NULL DEFAULT 0 ,
`author`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`title`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`slug`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`release_date`  datetime NULL DEFAULT NULL ,
`tags`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`format`  int(10) UNSIGNED NULL DEFAULT 1 ,
`cid`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`duration`  int(10) UNSIGNED NULL DEFAULT NULL ,
`image`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`is_banned`  tinyint(1) NULL DEFAULT 0 ,
`created_at`  datetime NOT NULL ,
`updated_at`  datetime NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci

;

DROP TABLE IF EXISTS `song_responses`;
CREATE TABLE `song_responses` (
`id`  int(10) UNSIGNED NOT NULL AUTO_INCREMENT ,
`media_type`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`trigger`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`response`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`rate`  int(11) NULL DEFAULT '0' ,
`is_active`  tinyint(1) NULL DEFAULT 0 ,
`created_at`  datetime NOT NULL ,
`updated_at`  datetime NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci

;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
`id`  int(10) UNSIGNED NOT NULL DEFAULT 0 ,
`username`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`slug`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
`language`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'en' ,
`avatar_id`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`badge`  varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL ,
`blurb`  text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL ,
`global_role`  int(11) UNSIGNED NULL DEFAULT 0 ,
`mod_user_id`  int(11) UNSIGNED NULL DEFAULT 0 ,
`role`  int(11) UNSIGNED NULL DEFAULT 0 ,
`level`  int(11) UNSIGNED NULL DEFAULT 0 ,
`experience_points`  int(11) UNSIGNED NULL DEFAULT 0 ,
`plug_points`  int(11) UNSIGNED NULL DEFAULT 0 ,
`joined`  datetime NULL DEFAULT NULL ,
`birthday`  datetime NULL DEFAULT NULL ,
`waitlist_position`  int(11) NULL DEFAULT '-1' ,
`last_seen`  datetime NULL DEFAULT NULL ,
`last_active`  datetime NULL DEFAULT NULL ,
`created_at`  datetime NOT NULL ,
`updated_at`  datetime NOT NULL ,
PRIMARY KEY (`id`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=latin1 COLLATE=latin1_swedish_ci

;
