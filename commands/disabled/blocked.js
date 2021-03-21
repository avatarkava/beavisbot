exports.names = ['blocked'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    function getBlockedCountries(ytid, func) {
        var reqparams = {ytid: ytid};
        request({
            url: 'http://polsy.org.uk/stuff/ytrestrict.cgi?',
            qs: reqparams,
            method: 'GET'
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                func(null);
            } else {
                try {
                    var tablestart = '<table style="border-spacing: 20px 0px">';
                    var copy = body.replace(/(?:\r\n|\r|\n)/g, '');
                    var index = copy.indexOf(tablestart);
                    if (index > -1) {
                        var index2 = copy.indexOf("</table>");
                        copy = copy.substr(index + tablestart.length, index2);
                    }
                    copy = copy.split("<tr>");

                    var status = '';
                    var allowed = [];
                    var blocked = [];
                    var htmltagregex = /(<([^>]+)>)/ig
                    for (var i = 0; i < copy.length; i++) {
                        if (copy[i].substr(0, 4) == '<td>') {
                            var rest = copy[i].substr(4);
                            index = rest.indexOf('<td>');
                            if (index > -1) {
                                var country = rest.substr(index + 4).replace(htmltagregex, "").split("-");
                                if (country.length > 1) {
                                    country.splice(0, 1);
                                }
                                country = country.join('-').trim();
                                if (country != '')
                                    blocked.push(country);
                            }
                        }
                    }

                    func(blocked);
                }
                catch (error) {
                    func(null);
                }
            }
        });
    }

    if (bot.getMedia() !== undefined && bot.getMedia().cid !== undefined) {

        getBlockedCountries(bot.getMedia().cid, function (blockedcountries) {

            if (blockedcountries === undefined || blockedcountries === null) {
                bot.sendChat('Sorry, I was\'nt able to check for blocked countries');
            }
            else if (blockedcountries.length == 0) {
                bot.sendChat('Yay! This song has no restrictions');
            }
            else if (blockedcountries.length > 24) {
                bot.sendChat('This song is blocked in ' + blockedcountries.length + ' countries, so I won\'t list them all.');
            }
            else {
                bot.sendChat('This song is blocked in: ' + blockedcountries.join(', '));
            }
        });
    }
    else {
        bot.sendChat("There's no song running or it's not from YouTube");
    }

};