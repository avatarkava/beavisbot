DROP TABLE IF EXISTS `event_responses`;
CREATE TABLE `event_responses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `event_type` varchar(255) NOT NULL,
  `trigger` varchar(255) DEFAULT NULL,
  `response` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `details` text,
  `result` text,
  `participants` int(10) unsigned DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `mod_user_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `mod_user_id` (`mod_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `karmas`;
CREATE TABLE `karmas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `details` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `mod_user_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `mod_user_id` (`mod_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `plays`;
CREATE TABLE `plays` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` varchar(255) NOT NULL,
  `positive` int(10) unsigned DEFAULT '0',
  `negative` int(10) unsigned DEFAULT '0',
  `grabs` int(10) unsigned DEFAULT '0',
  `listeners` int(10) unsigned DEFAULT '0',
  `skipped` int(10) unsigned DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `song_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `song_id` (`song_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `room_events`;
CREATE TABLE `room_events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `details` text,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `mod_user_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mod_user_id` (`mod_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `song_responses`;
CREATE TABLE `song_responses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `media_type` varchar(255) DEFAULT NULL,
  `trigger` varchar(255) NOT NULL,
  `response` varchar(255) DEFAULT NULL,
  `rate` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `songs`;
CREATE TABLE `songs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `release_date` date DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `host` varchar(255) NOT NULL DEFAULT 'youtube',
  `host_id` varchar(255) NOT NULL,
  `duration` int(10) unsigned DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_banned` tinyint(1) DEFAULT '0',
  `banned_reason` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_id` (`site_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `site_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `locale` varchar(255) DEFAULT 'en_US',
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text,
  `role` varchar(255) DEFAULT NULL,
  `site_points` int(10) unsigned DEFAULT '0',
  `custom_points` int(10) unsigned DEFAULT '0',
  `joined` datetime DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `queue_position` int(11) DEFAULT '-1',
  `last_seen` datetime DEFAULT NULL,
  `last_active` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_id` (`site_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `games` ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `games` ADD CONSTRAINT `games_ibfk_2` FOREIGN KEY (`mod_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `karmas` ADD CONSTRAINT `karmas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `karmas` ADD CONSTRAINT `karmas_ibfk_2` FOREIGN KEY (`mod_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `plays` ADD CONSTRAINT `plays_ibfk_1` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `plays` ADD CONSTRAINT `plays_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `room_events` ADD CONSTRAINT `room_events_ibfk_1` FOREIGN KEY (`mod_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;


