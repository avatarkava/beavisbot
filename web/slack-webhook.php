<?php
/*
// Set variables
$post        = strtolower($_POST['text']);
$bot_command = '!liz ';

// Start Slack Outgoing hooking
$data .= $post . "\r\n";
if ($_POST['channel_id'] == 'XXX' && $_POST['token'] == 'XXX') {

    // Restarts bot
    if ($post == $bot_command . 'restart') {
        shell_exec('pm2 restart Beavis');
        $text = 'I am restarting now!';

        $message = ['text' => $text];

        echo json_encode($message);
    } // Kills bot
    elseif ($post == $bot_command . 'die' || $post == $bot_command . 'kill' || $post == $bot_command . 'stop') {
        shell_exec('pm2 stop Beavis');
        $text = 'I am shutting down!';

        $message = ['text' => $text];

        echo json_encode($message);
    } // Show how many times bot restarted
    elseif ($post == $bot_command . 'restart time') {
        $output = shell_exec('pm2 jlist');
        $json   = json_decode($output);
        $status = $json[2]->pm2_env->restart_time;

        $text = 'I have restarted ' . $status . ' times.';

        $message = ['text' => $text];

        echo json_encode($message);
    } // Bot status
    elseif ($post == $bot_command . 'status') {
        $output = shell_exec('pm2 jlist');
        $json   = json_decode($output);
        $status = $json[2]->pm2_env->status;
        if ($status == 'stopped') {
            $status = 'offline';
        }

        $text = 'I am currently ' . $status . '.';

        $message = ['text' => $text];

        echo json_encode($message);
    } // Start bot
    elseif ($post == $bot_command . 'start') {
        if ($result = shell_exec('pm2 restart Beavis')) {
            $text = 'Waking up!';
        }

        $message = ['text' => $text];

        echo json_encode($message);
    } // Show bot's log
    elseif ($post == $bot_command . 'log') {
        if ($result = shell_exec('tail /home/harajuku/.pm2/logs/Beavis-out-2.log')) {
            $text = $result;
        }

        $message = ['text' => $text];

        echo json_encode($message);
    } // Show # lines of bot's log
    elseif (preg_match('#' . $bot_command . 'log [0-9]#', $post)) {
        preg_match('/\d+/', $post, $line);
        if ($result = shell_exec('tail -n ' . $line[0] . ' /home/harajuku/.pm2/logs/Beavis-out-2.log')) {
            $text = $result;
        }

        $message = ['text' => $text];

        echo json_encode($message);
    } // Show bot help
    elseif ($post == $bot_command . 'help') {
        $text = 'To control me, you need to type ' . $bot_command . ' followed by the controls below.
                    E.g. <' . $bot_command . 'status> to show my on/offline status

                    Available commands are:
                    *status* — Show my online/offline status.
                    *start* — Start me up if I\'m offline.
                    *die/kill/stop* — Shut me down.
                    *restart* — Restart me.
                    *restart time* — Show how many times I\'ve rebooted myself.
                    *log* — Show the last 10 things I see in my console.
                    *log #* — Show the last # things I see in my console.
                    *help* — Display this list';

        $message = ['text' => $text];

        echo json_encode($message);
    } // If all else fails...
    else {
        $message = ['text' => 'I\'m sorry, but I don\'t understand you.'];
        echo json_encode($message);
    }
} else {
    $message = ['text' => 'hi'];
    echo json_encode($message);
}
*/
?>