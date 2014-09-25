BeavisBot
==========

BeavisBot is a heavily-adapted port of SparkleBot, which got its start on turntable.fm and migrated to plug.dj after tt.fm's demise.

This bot uses https://github.com/TATDK/plugapi as its API dependency and is designed to be run using a node.JS instance.

Quick Installation
-----------------------
1. Run `npm install` in the root folder of the checkout
2. Copy the config.sample.json from /install to the root folder and rename it config.json
3. Edit config.json to suit your needs
4. If you are using SQLite, copy the supplied sample.sqlite to the root folder and rename it to align with your settings in config.json

Known issues are located at https://github.com/AvatarKava/BeavisBot/issues - please submit any bug reports or feature requests there!

Logging and Log Rotation
------------------------

Full details are here: https://github.com/Unitech/pm2

Start the process in pm2 with custom log locations:
```
pm2 start /srv/web/apps/plug.dj/BeavisBot/bot.js --name beavisbot -o /var/log/node/beavisbot.log -e /var/log/node/beavisbot.err --run-as-user=www-data
```
Set pm2 to automatically run on startup
```
pm2 startup <ubuntu|centos|gentoo|systemd>
```
Save the processes running so they get restored any time pm2 is started
```
pm2 save
```

then in /etc/logrotate.d
```
/var/log/node/* {
    daily
    rotate 30
    missingok
    notifempty
    sharedscripts
    copytruncate
    compress
    delaycompress
    dateext
}
```