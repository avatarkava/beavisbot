<?php
/**
 * Custom configuration settings for use with plugCubed users
 */
header("Access-Control-Allow-Origin: https://plug.dj");
header('Content-Type: text/json');

$bot_id = '3819806';
?>
{
    "instructions": "http://issue.plugcubed.net/wiki/Plug3%3ARSS",
    "author": "AvatarKava",
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
                "border": "1px solid #009cdd",
                "border-left": "0px !important",
                "border-right": "0px !important",
                "border-collapse": "collapse !important"
            },
            "#chat .mention.is-staff": {
            },
            "#chat .welcome": {
                "background-color": "rgba(24, 0, 38, 0.5) !important",
                "border": "3px solid #009cdd",
                "border-left": "0px !important",
                "border-right": "0px !important",
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
                "background": "url('//beavisbot.phpmonkeys.com/images/icons/beavis_icon.png') !important"
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
        "background": "//beavisbot.phpmonkeys.com/images/background/default.jpg",
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
        "playback": "//beavisbot.phpmonkeys.com/images/tv-background.gif"
    },
    "rules": {
        "allowAutorespond": "false",
        "allowAutowoot": "true",
        "allowAutojoin": "false"
    }
}