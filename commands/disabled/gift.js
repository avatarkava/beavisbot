exports.names = ["gift"];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
  var input = data.text.split(" ");
  var params = _.rest(input, 1);
  var username = _.initial(params).join(" ");
  var amount = parseInt(_.last(params));

  if (!amount || isNaN(amount) || amount < 1 || !username) {
    bot.speak("usage: .gift @username 50 (gifts 50 points)");
    return;
  }

  var usernameFormatted = S(username).chompLeft("@").s;
  var user = findUserInList(bot.getUsers(), usernameFormatted);

  if (!user) {
    bot.speak(`user ${username} was not found.`);
  }

  getDbUserFromSiteUser(data.from, function (row) {
    if (!row || row.custom_points == 0) {
      bot.speak(`You do not have any ${config.customPointName} to give, @${data.name}.`);
      return;
    } else if (row.custom_points < amount) {
      bot.speak(`You only have ${row.custom_points} ${config.customPointName} to give, @${data.name}.`);
      return;
    }

    transferCustomPoints(data.userid, user, amount);
  });
};
