const fetch = require("node-fetch");

exports.names = ["catfact", "catfacts"];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
  fetch("https://cat-fact.herokuapp.com/facts/random?amount=1")
    .then((res) => res.json())
    .then((json) => bot.speak(json.text))
    .catch((err) => console.error(err));
};
