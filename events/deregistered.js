module.exports = function () {
  bot.on("deregistered", function (data) {
    if (config.verboseLogging) {
      console.log("[EVENT] deregistered", data);
    }

    data.user.forEach(function (user) {
      if (user.name === undefined) {
        console.log(`[LEAVE] Guest left`);
      } else {
        console.log(`[LEAVE] User left: ${user.name}`);
        models.User.update({ last_leave: new Date(), last_seen: new Date() }, { where: { site: config.site, site_id: user.userid } });
      }
    });
  });
};
