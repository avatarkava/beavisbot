module.exports = function () {
  bot.on("roomChanged", function (data) {
    console.log("[EVENT] Ready - joined room: " + data.room.name);
    if (config.verboseLogging) {
      console.log("[INIT] Room data: " + JSON.stringify(data, null, 2));
    }

    roomState.room = data.room;
    roomState.users = data.users;
    roomState.waitList = data.djids;

    if (config.responses.botConnect !== "") {
      bot.speak(config.responses.botConnect);
    }

    data.users.forEach(function (user) {    
      if (user.userid == config.auth.userId) {
        bot.user = user;
        if (config.verboseLogging) {
          console.log("[INIT] Data loaded for " + bot.user.name + "\n " + JSON.stringify(bot.user, null, 2));
        }
      }

      // @TODO bulkify this using bulkCreate()
      updateDbUser(user);      
    });

    if (config.queue.upvoteSongs == "ALL" && data.room.metadata.current_song) {
      bot.bop();
    }
    
  });
};
