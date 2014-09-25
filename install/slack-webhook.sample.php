<?php
/**
 * Handles an outgoing-webhook request from Slack.com
 * https://api.slack.com/
 */
header('Content-Type: application/json');

$config = json_decode(file_get_contents('../config.json'));
$pm2_name = $config->slack->pm2->instance_name;

// Deal with expected incoming data from $_POST
$token        = $_POST['token'];
$team_id      = $_POST['team_id'];
$channel_id   = $_POST['channel_id'];
$channel_name = $_POST['channel_name'];
$timestamp    = $_POST['timestamp'];
$user_id      = $_POST['user_id'];
$user_name    = $_POST['user_name'];
$text         = $_POST['text'];
$trigger_word = $_POST['trigger_word'];

// Strip the trigger word from text
$text = trim(str_replace($trigger_word, '', $text));
list($command, $parameters) = explode(' ', $text, 1);

if (1 || $_POST['channel_id'] == 'XXX' && $_POST['token'] == 'XXX') {
    switch ($command) {
        case 'reload':
        case 'reset':
        case 'restart':
        case 'start':
            shell_exec('pm2 restart ' . $pm2_name);
            $message = 'Restarting ' . $pm2_name;
            break;
        case 'die':
        case 'kill':
        case 'stop':
            shell_exec('pm2 stop ' . $pm2_name);
            $message = 'Shutting down ' . $pm2_name;
            break;
        case 'status':
            $output = shell_exec('pm2 jlist');
            $json   = json_decode($output);
            $message = "I'm currently " . $json[2]->pm2_env->status . " and have restarted " . $json[2]->pm2_env->restart_time . " times.";
        case 'log':
            //preg_match('/\d+/', $post, $line);
            //if ($result = shell_exec('tail -n ' . $line[0] . ' /home/harajuku/.pm2/logs/Beavis-out-2.log')) {
            //    $text = $result;
            //}
            $message = "I don't do anything yet";
            break;
        case 'help':
        default:
            $message = "To control me, you need to type " . $trigger_word . " followed by one of the commands below.
                    E.g. <" . $trigger_word . "status> to show my on/offline status
                    Available commands are:
                    *status* — Show my online/offline status.
                    *start* — Start me up if I'm offline.
                    *stop* — Shut me down.
                    *restart* — Restart me.
                    *restart time* — Show how many times I've rebooted myself.
                    *log* — Show the last 10 things I see in my console.
                    *log #* — Show the last # things I see in my console.
                    *help* — Display this list";
    }
}

// Return data
$json = [
    'text'       => $message,
    'username'   => $username,
    'link_names' => 1
];
return json_encode($json);