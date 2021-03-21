module.exports = function () {
  bot.on("ready", function () {
    console.log("[EVENT] Ready: Connected...");
    bot.roomRegister(config.roomId);

    //writeConfigState();
  });
};
