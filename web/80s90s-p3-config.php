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
            "#chat .mention": {
                "background-color": "rgba(24, 0, 38, 0.5) !important",
                "border": "2px solid #1e75fb",
                "border-left": "0px !important",
                "border-right": "0px !important"
            },
            "#chat .mention.is-staff": {
                "border-color": "#ac76ff"
            },
            "#chat .welcome": {
                "border": "3px dashed #1e75fb",
                "font-weight": "bold",
                "padding": "5px 2px 5px 25px"
            },
            "#chat .from-<?=$bot_id?>": {
                "border-left": "#ac76ff 0px solid",
                "background-color": "rgba(24, 0, 38, 0.5) !important"
            },
            "#chat .from-<?=$bot_id?> .from.staff.clickable": {
            },
            ".from-<?=$bot_id?> .icon-chat-manager": {
                "background": "url('http://beavisbot.phpmonkeys.com/images/icons/beavis_icon.png') !important"
            },
            "#chat .from-<?=$bot_id?> .from": {
            },
            "#chat .from-<?=$bot_id?> .text": {
                "color": "rgb(238, 238, 238) !important",
                "font-style": "normal",
                "font-weight": "normal"
            },
            "#chat .nxnotif": {
                "border": "0 !important"
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