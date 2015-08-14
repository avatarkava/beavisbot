/* Make sure new format for the songs table gets pushed up to the install folder */
DROP TABLE IF EXISTS songs_new;
CREATE TABLE songs_new LIKE songs;
ALTER TABLE `songs_new` CHANGE `id` `id` BIGINT(11) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `songs_new` ADD `plug_id` INT(10) UNSIGNED NULL DEFAULT NULL AFTER `cid`;
ALTER TABLE `songs_new` ADD UNIQUE( `format`, `cid`);
INSERT IGNORE INTO songs_new (SELECT null, author, title, slug, release_date, tags, format, cid, id, duration, image, is_banned, created_at, updated_at FROM songs);
UPDATE plays p SET song_id = (SELECT sn.id FROM songs_new sn INNER JOIN songs s ON sn.cid = s.cid AND sn.format = s.format WHERE p.song_id = s.id );
DROP TABLE songs;
CREATE TABLE songs LIKE songs_new;
INSERT INTO songs (SELECT * FROM songs_new);
DROP TABLE songs_new;

ALTER TABLE `users` ADD `custom_points` INT(10) UNSIGNED DEFAULT 0 AFTER `plug_points`;
INSERT IGNORE INTO songs (SELECT null, author, title, '', null, null, format, cid, id, duration, null, 0, now(), now() FROM zzz_old_songs);
DROP TABLE `zzz_old_songs`;

ALTER TABLE `zzz_old_plays` ADD `isImported` TINYINT(1) UNSIGNED DEFAULT 0;
DELETE FROM `zzz_old_plays` WHERE songid IS NULL OR userid IS NULL;