exports.names = ["emoji"];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
  bot.speak("Emoji List: http://www.emoji-cheat-sheet.com");
};
