<?php 

$db = new PDO('mysql:host=localhost;dbname=beavisbot;charset=utf8', 'root', '9jekjv5H');

// Pseudo for user update
$stmt = $db->query("SELECT * FROM zzz_old_users WHERE isImported = 0 AND dateJoined > NOW() - INTERVAL 24 HOUR ORDER BY dateJoined");
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
