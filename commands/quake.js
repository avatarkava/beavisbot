const fetch = require("node-fetch");

exports.names = ["quake"];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
  var factApi = fetch("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson")
    .then((res) => res.json())
    .then((json) => {
      var quakes = json.features.slice(0, 3);
      bot.speak(
        "Recent earthquakes: " +
          _.map(quakes, function (quake) {
            var timeElapsed = new Date() - new Date(quake.properties.time);
            return quake.properties.title + " (" + Math.floor(timeElapsed / 3600000) + "h" + Math.floor((timeElapsed % 3600000) / 60000) + "m ago)";
          }).join(" · ")
      );
    })
    .catch((err) => console.error(err));
};
