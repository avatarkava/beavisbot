<?php

$config = json_decode(file_get_contents(__DIR__ . '/../config.json'), true);
$db_host = $config['db']['host'];
$db_name = $config['db']['database'];
$db_user = $config['db']['username'];
$db_pass = $config['db']['password'];
$db = new PDO('mysql:host=' . $db_host . ';dbname=' . $db_name . ';charset=utf8', $db_user, $db_pass);
$dbOld = new PDO('mysql:host=' . $db_host . ';dbname=beavisbot_old;charset=utf8', $db_user, $db_pass);

// Pseudo for user update
$stmt = $db->query("SELECT * FROM songs ORDER BY id");
$numSongs = $stmt->rowCount();
echo "\n$numSongs songs were found...\n";
$x = 0;

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

    $x++;    
    echo "\n[" . $x . '/' . $numSongs . '] processing song ' . $row['id'] . ':' . $row['name'] . '...';    
    //print_r($row);

    // Find another copy of this song from the same site with the same host and host_id (merge dupes)
    $stmtDupes = $db->prepare("SELECT * FROM songs WHERE site = :site AND host = :host AND host_id = :host_id AND id != :id ");
    $stmtDupes->bindParam('site', $row['site']);
    $stmtDupes->bindParam('host', $row['host']);
    $stmtDupes->bindParam('host_id', $row['host_id']);
    $stmtDupes->bindParam('id', $row['id']);    
    $stmtDupes->execute();    

    $numDupes = $stmtDupes->rowCount();

    if($numDupes > 0) {
    	echo "\n$numDupes duplicates for this song found...";    
    }

    while ($song = $stmtDupes->fetch(PDO::FETCH_ASSOC)) {        

		echo "\nGoing to map song_id: " . $song['id'] . " => " . $row['id'];

        $stmtPlays = $db->prepare("UPDATE plays SET song_id = :originalSongId WHERE song_id = :dupeSongId");
        $stmtPlays->bindParam('originalSongId', $row['id']);
        $stmtPlays->bindParam('dupeSongId', $song['id']);
        $stmtPlays->execute();

		echo "\nRemoving song_id: " . $song['id'];
        $stmtCleanup = $db->prepare("DELETE FROM songs WHERE id = :dupeSongId LIMIT 1");
        $stmtCleanup->bindParam('dupeSongId', $song['id']);
        $stmtCleanup->execute();
        
        // Update any plays with the old songId to reflect the original one
        // Delete the dupe copy of the song


        // // Get all plays from zzz_old_plays for this user
        // $stmtPlays = $db->prepare("SELECT * FROM zzz_old_plays WHERE userid = :olduserid AND isImported = 0");
        // $stmtPlays->bindParam('olduserid', $row['userid']);
        // $stmtPlays->execute();
        // $numPlays = $stmtPlays->rowCount();
        // echo "\n$numPlays plays found...";

        // $stmtNewPlay = $db->prepare("INSERT INTO plays SET positive = :upvotes
        //                         , negative = :downvotes
        //                         , grabs = :snags
        //                         , listeners = :listeners
        //                         , skipped = 0
        //                         , created = :started
        //                         , updated = :started
        //                         , song_id = :songid
        //                         , user_id = :userid");

        // $stmtUpdateOldPlay = $db->prepare("UPDATE zzz_old_plays SET isImported = 1 WHERE id = :id LIMIT 1");
        // $stmtUpdateUser = $db->prepare("UPDATE zzz_old_users SET isImported = 1 WHERE userid = :olduserid LIMIT 1");

        // while ($play = $stmtPlays->fetch(PDO::FETCH_ASSOC)) {
        //     $y++;

        //     // Get the proper new SongId
        //     list($format, $cid) = explode(':', $play['songid']);
        //     $stmtNewSong = $db->prepare("SELECT id FROM songs WHERE format = :format and cid = :cid LIMIT 1");
        //     $stmtNewSong->bindParam('format', $format);
        //     $stmtNewSong->bindParam('cid', $cid);
        //     //$stmtNewSong->debugDumpParams();
        //     $stmtNewSong->execute();

        //     if ($newSong = $stmtNewSong->fetch(PDO::FETCH_ASSOC)) {

        //         $stmtNewPlay->bindParam('upvotes', $play['upvotes']);
        //         $stmtNewPlay->bindParam('downvotes', $play['downvotes']);
        //         $stmtNewPlay->bindParam('snags', $play['snags']);
        //         $stmtNewPlay->bindParam('listeners', $play['listeners']);
        //         $stmtNewPlay->bindParam('started', $play['started']);
        //         $stmtNewPlay->bindParam('userid', $newUserId);
        //         $stmtNewPlay->bindParam('songid', $newSong['id']);
        //         //$stmtNewPlay->debugDumpParams();
        //         //$stmtNewPlay->execute();

        //         // Set the play to imported
        //         $stmtUpdateOldPlay->bindParam('id', $play['id']);
        //         //$stmtUpdateOldPlay->execute();

        //     }
        // }

        // $stmtUpdateUser->bindParam('olduserid', $row['userid']);
        // //$stmtUpdateUser->execute();

    } 
}
