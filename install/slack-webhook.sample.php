<?php
/**
 * Handles an outgoing-webhook request from Slack.com
 * https://api.slack.com/
 */
header('Content-Type: application/json');

$config = json_decode(file_get_contents('../config.json'));
$pm2_name = $config->slack->pm2->instance_name;
$pm2_path = $config->slack->pm2->bin_path;
$pm2_log_path = $config->slack->pm2->log_path;

// You made need the below commands in order to get this working on your specific operating system
// $pm2_name = $pm2_name . ' 2>&1';
// $pm2_path = 'HOME="${HOME:=/root}" ' . $pm2_path;

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
list($command, $parameters) = explode(' ', $text, 2);

if ($_POST['team_id'] == $config->slack->pm2->team_id && $_POST['token'] == $config->slack->pm2->token) {
    switch ($command) {
        case 'reload':
        case 'reset':
        case 'restart':
            $result = shell_exec($pm2_path . ' restart ' . $pm2_name);
            $message = "I'm restarting...";
            break;
        case 'die':
        case 'kill':
        case 'stop':
            $result = shell_exec($pm2_path . ' stop ' . $pm2_name);
            $message = "I'm shutting down...";
            break;
        case 'status':
            $output = shell_exec($pm2_path . ' jlist');
            $json   = json_decode($output);
            file_put_contents('output.txt', $output);
            $message = "I'm currently " . $json[0]->pm2_env->status . " and have restarted " . $json[0]->pm2_env->restart_time . " times.";
            break;
        case 'log':
            if (intval($parameters) > 0 && intval($parameters) < 1000) {
                $lines = intval($parameters);
            }
            else {
                $lines = 10;
            }
            $result = shell_exec('tail -n ' . $lines . ' ' . $pm2_log_path . ' 2>&1');
            $message = "Here are the last $lines lines from my log:\n```" . $result . "```";
            break;
        case 'start':
            $result = shell_exec($pm2_path . ' restart ' . $pm2_name);
            $message = "I'm starting...";
            break;
        case 'help':
        default:
            $message = "To control me, you need to type `" . $trigger_word . "` followed by one of the commands below.
                    E.g. `" . $trigger_word . " status` to show my on/offline status
                    Available commands are:
                    `status` — Show my online/offline status.
                    `start` — Start me up f I'm offline.
                    `stop` — Shut me down.
                    `restart` — Restart me.
                    `log #` — Show the last # things I see in my consle (default 10).
                    `help` — Display this lst";
    }
}

// Return data
$json = [
    'text'       => $message,
    'link_names' => 1
];
echo json_encode($json);
