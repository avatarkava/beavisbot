const fetch = require("node-fetch");

exports.names = ["fact"];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
  var month = new Date().getMonth() + 1;
  var day = new Date().getDate();
  var factApi = fetch(`http://numbersapi.com/random/trivia`)
    .then((res) => res.text())
    .then((body) => bot.speak(body))
    .catch((err) => console.error(err));
};
