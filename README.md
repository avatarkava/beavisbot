SparkleBot
==========

A port of Sparkle Turntable Bot for plug.dj. This bot uses https://github.com/atomjack/plugapi as its API dependency - since it's not on NPM yet you'll need to install it yourself. Otherwise, everything's included except node - just remove the `.sample` from the config and database files, replace the DB values with your own, and everything should work.

Known Issues
==========
* The bot will occasionally disconnect from Plug.DJ - it'll still be able to send and receive chat messages but will not receive any other events.
