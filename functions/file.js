const { writeFile } = require("fs");

module.exports = function () {
  writeConfigState = function () {
    writeFile(
      "../configState.json",
      JSON.stringify(
        config,
        function (key, value) {
          if (key == "parent") {
            return value.id;
          } else {
            return value;
          }
        },
        2
      ),

      function (err) {
        if (err) {
          console.log(err);
          return console.log(err);
        }
      }
    );
  };

  writeRoomState = function (permalink) {
    // Writes current room state to outfile so it can be used for the web
    if (config.roomStateFile) {
      var JSONstats = {};

      JSONstats.media = bot.getMedia();
      JSONstats.permalink = permalink;
      JSONstats.dj = bot.getDJ();
      JSONstats.roomQueue = bot.getWaitList();
      JSONstats.users = bot.getUsers();
      JSONstats.staff = bot.getStaff();
      JSONstats.lastPlay = bot.lastPlay;
      JSONstats.mediaHistory = bot.mediaHistory;

      writeFile(
        config.roomStateFile,
        JSON.stringify(
          JSONstats,
          function (key, value) {
            if (key == "parent") {
              return value.id;
            } else {
              return value;
            }
          },
          2
        ),

        function (err) {
          if (err) {
            console.log(err);
            return console.log(err);
          }
        }
      );
    }
  };
};
