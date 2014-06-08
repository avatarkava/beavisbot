<?php
header("Access-Control-Allow-Origin: http://plug.dj");
header('Content-Type: text/json');

$bot_id = '52cc583f3e083e226a242efd';
?>
{
    "instructions": "http://issue.plugcubed.net/wiki/Plug3%3ARSS",
    "colors": {
        "background": "",
        "chat": {
            "admin": "",
            "ambassador": "",
            "bouncer": "",
            "cohost": "",
            "residentdj": "",
            "host": "",
            "manager": ""
        },
        "footer": "",
        "header": ""
    },
    "css": {
        "font": [
        ],
        "import": [
        ],
        "rule": {
            "#chat .message:nth-child(2n+1),#chat .mention:nth-child(2n+1),#chat .skip:nth-child(2n+1),#chat .moderation:nth-child(2n+1),#chat .emote:nth-child(2n+1),#chat .update:nth-child(2n+1),#chat .welcome:nth-child(2n+1)": {
                "background-color": "rgba(17, 19, 23, 0.75)"
            },
            "#chat .emote.from-<?=$bot_id?>": {
                "border-left": "#ac76ff 3px solid",
                "background-color": "rgba(24, 0, 38, 0.9) !important"
            },
            ".emote.from-<?=$bot_id?> .from.staff.clickable": {
                "display": "none"
            },
            ".emote.from-<?=$bot_id?> .icon-chat-manager": {
                "display": "none"
            },
            "#chat .emote.from-<?=$bot_id?> .from": {
                "color": "#ac76ff !important"
            },
            "#chat .emote.from-<?=$bot_id?> .text": {
                "font-style": "normal",
                "font-weight": "bold",
                "color": "#ac76ff"
            }
        }
    },
    "images": {
        "background": "https://dl.dropboxusercontent.com/u/3725813/i%20love80%27s.jpg",
        "booth": "",
        "icons": {
            "admin": "",
            "ambassador": "",
            "bouncer": "",
            "cohost": "",
            "residentdj": "",
            "host": "",
            "manager": ""
        },
        "playback": "http://i.imgur.com/8xFgQmU.png"
    },
    "rules": {
        "allowAutorespond": "false",
        "allowAutowoot": "true",
        "allowAutojoin": "false"
    }
}
