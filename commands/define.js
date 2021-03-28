const fetch = require("node-fetch");

exports.names = ["define"];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
  var input = _.rest(data.text.split(" "), 1).join(" ").trim();

  if (input.length > 0 && config.apiKeys.wordnik) {
    var uri = "http://api.wordnik.com:80/v4/word.json/" + input + "/definitions?limit=5&includeRelated=false&useCanonical=true&includeTags=false&api_key=" + config.apiKeys.wordnik;

    fetch(uri)
      .then((res) => res.json())
      .then((json) => {
        if (config.verboseLogging) {
          console.log("[DEFINE]", JSON.stringify(json, null, 2));
        }

        if (json.length == 0) {
          bot.speak("No definition for " + input + " found.");
        } else {
          bot.speak(json[0].word + " [" + json[0].partOfSpeech + "] - " + json[0].text);
        }
      })
      .catch((err) => console.error(err));
  }
};
