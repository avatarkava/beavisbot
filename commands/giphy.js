exports.names = ['giphy'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function (data) {

    function getGifURL(api_key, func, tags)
    {
        var reqparams = {format: 'json', api_key: api_key, "rating" : rating};
        if(tags !== undefined){
            reqparams["tag"] = tags;
        }
        request({
            url: 'https://tv.giphy.com/v1/gifs/random?',
            qs: reqparams,
            method: 'GET'
        }, function(error, response, body){
            if(error) {
                console.log(error);
                func(null);
            } else {
                try {
                    var data = JSON.parse(body);
                    func(data.data.image_original_url);
                }
                catch(error){
                    func(null);
                }
            }
        });
    }

    var params = _.rest(data.message.split(' '), 1);
    var api_key = "dc6zaTOxFJmzC"; // public beta key
    var rating = "pg-13"; // PG 13 gifs
    var tag = null;

    if (params.length > 0) {
        tag = params.join('+').trim().replace(/ /g, ", ");
    }

    getGifURL(api_key, function(imageurl) {
        if (typeof imageurl !== 'undefined') {
            bot.sendChat(imageurl);
        } else {
            bot.sendChat('Could not find any gif with this tag(s)');
        }
    }, tag != null ? tag : null);

};