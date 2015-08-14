<?php

/*
// Make sure new format for the songs table gets pushed up to the install folder
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
*/

/****
// USERS that weren't imported (grouped by # of spins)
mysql> select zzz_old_users.userid, username, count(*) from zzz_old_plays INNER JOIN zzz_old_users ON zzz_old_users.userid = zzz_old_plays.userid where zzz_old_plays.isImported =0 GROUP BY zzz_old_plays.userid order by count(*) ASC;

*/

$db = new PDO('mysql:host=localhost;dbname=beavisbot;charset=utf8', 'root', '9jekjv5H');

// Pseudo for user update
$stmt = $db->query("SELECT * FROM zzz_old_users WHERE isImported = 0 ORDER BY dateJoined");
$numUsers = $stmt->rowCount();
echo "\n$numUsers users were found...\n";
$x = 0;

while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

	$x++;
	echo "\n[" . $x . '/' . $numUsers . '] processing user ' . $row['username'] . '...';

	// Look for someone with the same username in the current users table
	$stmtUser = $db->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
	$stmtUser->bindParam('username', $row['username']);
	$stmtUser->execute();

	if($newUser = $stmtUser->fetch(PDO::FETCH_ASSOC)) {

		$y = 0;
		// If found, grab their new user_id and flag the isImported field in zzz_old_users = 1
		$newUserId = $newUser['id'];

		// Get all plays from zzz_old_plays for this user
		$stmtPlays = $db->prepare("SELECT * FROM zzz_old_plays WHERE userid = :olduserid AND isImported = 0");
		$stmtPlays->bindParam('olduserid', $row['userid']);
		$stmtPlays->execute();
		$numPlays = $stmtPlays->rowCount();
		//echo "\n$numPlays plays found...";

		$stmtNewPlay = $db->prepare("INSERT INTO plays SET positive = :upvotes
								, negative = :downvotes
								, grabs = :snags
								, listeners = :listeners
								, skipped = 0
								, created = :started
								, updated = :started
								, song_id = :songid
								, user_id = :userid");

		$stmtUpdateOldPlay = $db->prepare("UPDATE zzz_old_plays SET isImported = 1 WHERE id = :id LIMIT 1");
		$stmtUpdateUser = $db->prepare("UPDATE zzz_old_users SET isImported = 1 WHERE userid = :olduserid LIMIT 1");

		while($play = $stmtPlays->fetch(PDO::FETCH_ASSOC)) {
			$y++;

			// Get the proper new SongId
			list($format, $cid) = explode(':', $play['songid']);
			$stmtNewSong = $db->prepare("SELECT id FROM songs WHERE format = :format and cid = :cid LIMIT 1");
			$stmtNewSong->bindParam('format', $format);
			$stmtNewSong->bindParam('cid', $cid);
			//$stmtNewSong->debugDumpParams();
			$stmtNewSong->execute();

			if ($newSong = $stmtNewSong->fetch(PDO::FETCH_ASSOC)) {

				$stmtNewPlay->bindParam('upvotes', $play['upvotes']);
				$stmtNewPlay->bindParam('downvotes', $play['downvotes']);
				$stmtNewPlay->bindParam('snags', $play['snags']);
				$stmtNewPlay->bindParam('listeners', $play['listeners']);
				$stmtNewPlay->bindParam('started', $play['started']);
				$stmtNewPlay->bindParam('userid', $newUserId);
				$stmtNewPlay->bindParam('songid', $newSong['id']);
				//$stmtNewPlay->debugDumpParams();
				$stmtNewPlay->execute();

				// Set the play to imported
				$stmtUpdateOldPlay->bindParam('id', $play['id']);
				$stmtUpdateOldPlay->execute();

			}
		}

		$stmtUpdateUser->bindParam('olduserid', $row['userid']);
		$stmtUpdateUser->execute();

	}
	else {
		echo "\nNo match for " . $row['username'] . " found in current users table...";
	}
}