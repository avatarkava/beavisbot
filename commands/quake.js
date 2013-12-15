exports.names = ['.quake'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function(data) {
    request('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', function(error, response, body) {
        var quakes = JSON.parse(body).features.slice(0,3);
        bot.chat('Recent earthquakes: ' + _.map(quakes, function(quake) { 
            var timeElapsed = new Date() - new Date(quake.properties.time);
            return quake.properties.title + ' (' + Math.floor(timeElapsed/3600000) + 'h ' + Math.floor((timeElapsed % 3600000) / 60000) + 'm ago)';
        }).join(' · '));
    });
};