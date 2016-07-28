exports.names = ['giphy', 'giphyt', 'giphys'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    function getGifURL(api_key, func, tags) {
        var reqparams = {format: 'json', api_key: api_key, "rating": rating, "limit": 1};
        if (command == 'giphyt') {
            endpoint = '/v1/gifs/translate';
            search_param = 's';
            tags = tags.replace(/-/g, "+");
        } else if (command == 'giphys') {
            endpoint = '/v1/stickers/random';
            search_param = 'tag';
        } else {
            endpoint = '/v1/gifs/random';
            search_param = 'tag';
        }

        if (tags !== undefined) {
            reqparams[search_param] = tags;
        }

        request({
            url: 'https://api.giphy.com' + endpoint + '?',
            qs: reqparams,
            method: 'GET'
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                func(null);
            } else {
                try {
                    var data = JSON.parse(body);

                    if (config.verboseLogging) {
                        data.calloutendpoint = endpoint;
                        data.calloutqs = reqparams;
                        console.log('[GIPHY] ', JSON.stringify(data, null, 2));
                    }
                    if (command == 'giphyt') {
                        func(data.data.images.original.url);
                    } else {
                        func(data.data.image_url);
                    }
                }
                catch (error) {
                    func(null);
                }
            }
        });
    }

    var command = _.first(data.message.split(' '));
    var params = _.rest(data.message.split(' '), 1);
    var api_key = "dc6zaTOxFJmzC"; // public beta key
    var rating = "pg"; // PG gifs
    var tag = null;

    if (params.length == 0) {
        //@TODO - Add usage
        return;
    }

    tag = params.join('-').trim().replace(/ /g, "+");

    getGifURL(api_key, function (imageurl) {
        if (typeof imageurl !== 'undefined') {
            bot.sendChat(imageurl);
        } else {
            bot.sendChat('Could not find any gif tag(s): ' + tag);
        }
    }, tag != null ? tag : null);

};