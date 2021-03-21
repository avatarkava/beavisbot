exports.names = ["upvote"];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {
  var message = "";
  var input = _.rest(data.text.split(" "), 1).join(" ").trim();
  if (input.length > 1) {
    message = input + " ";
  }
  message += config.responses.upvoteReminder;
  bot.speak(message);
};
