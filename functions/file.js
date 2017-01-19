module.exports = function (bot) {

    writeConfigState = function () {
        fs.writeFile(
            'configState.json',
            CircularJSON.stringify(config, function (key, value) {
                if (key == 'parent') {
                    return value.id;
                }
                else {
                    return value;
                }
            }, 2),

            function (err) {
                if (err) {
                    console.log(err);
                    return console.log(err);
                }
            }
        );
    }

    writeRoomState = function (permalink) {
        // Writes current room state to outfile so it can be used for the web
        if (config.roomStateFile) {

            var JSONstats = {}

            JSONstats.media = bot.getMedia();
            JSONstats.permalink = permalink;
            JSONstats.dj = bot.getDJ();
            JSONstats.roomQueue = bot.getWaitList();
            JSONstats.users = bot.getUsers();
            JSONstats.staff = bot.getStaff();
            JSONstats.mediaHistory = bot.mediaHistory;

            fs.writeFile(
                config.roomStateFile,
                CircularJSON.stringify(JSONstats, function (key, value) {
                    if (key == 'parent') {
                        return value.id;
                    }
                    else {
                        return value;
                    }
                }, 2),

                function (err) {
                    if (err) {
                        console.log(err);
                        return console.log(err);
                    }
                }
            );

        }
    };
}