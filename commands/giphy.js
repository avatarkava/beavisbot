exports.names = ['giphy', 'giphyt', 'giphys'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var command = _.first(data.message.split(' '));
    var params = _.rest(data.message.split(' '), 1);
    var api_key = "dc6zaTOxFJmzC"; // public beta key
    var rating = "pg"; // PG gifs
    var tags = null;
    var limit = 20; // How many to randomly choose from
    var pointCost = config.giphyPointCost + 0;

    if (params.length == 0) {
        //@TODO - Add usage
        return;
    }

    attemptPurchase(data.from, pointCost, function(success) {
        if (success == true) {
            tags = params.join('+').trim().replace(/ /g, "+");

            getGiphy(command, api_key, rating, tags, limit, function (imageurl) {
                if (typeof imageurl !== 'undefined') {
                    bot.sendChat(imageurl);
                } else {
                    bot.sendChat('Could not find any gif tag(s): ' + tags);
                }
            }, tags != null ? tags : null);
        }
    });

};