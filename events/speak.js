module.exports = function () {
  bot.on("speak", function (data) {
    if (config.verboseLogging) {
      console.log("[SPEAK]", JSON.stringify(data, null, 2));
    } else if (data.userid && data.name) {
      console.log("[SPEAK]", data.name + ": " + data.text);
    }

    if (data.name) {
      data.text = data.text.trim();
      handleChat(data);
      /*
            models.User.update({
                last_active: new Date(),
                last_seen: new Date(),
                locale: data.from.language
            }, {where: {site_id: data.from.id.toString(), site: config.site}});
            */
    }
  });
};
