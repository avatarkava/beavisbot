exports.names = ['blocked'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
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
                    if( index > -1 ){
                        var index2 = copy.indexOf("</table>");
                        copy = copy.substr( index + tablestart.length, index2 );
                    }
                    copy = copy.split("<tr>");

                    var blocked = []; var htmltagregex = /(<([^>]+)>)/ig
                    for(var i = 0; i < copy.length; i++){
                        if(copy[i].substr(0, 4) == '<td>'  ){
                            var rest = copy[i].substr(4);
                            index = rest.indexOf('<td>');
                            if( index > -1){
                                var country = rest.substr(index + 4).replace(htmltagregex, "").split("-");
                                if(country.length > 1){
                                    country.splice(0,1);
                                }
                                country = country.join('-').trim();
                                if(country != '')
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

    if(bot.getMedia() !== undefined && bot.getMedia().fkid !== undefined) {

        getBlockedCountries( bot.getMedia().fkid, function (blockedcountries) {

            if(blockedcountries === undefined){
                bot.sendChat('Sorry wasnt able to check for blocked countries');
            }
            else if( blockedcountries.length == 0){
                bot.sendChat('Yay this song has no restrictions');
            }
            else{
                bot.sendChat('This song is blocked in: ' + blockedcountries.join(', '));
            }
        });
    }
    else{
        bot.sendChat("There's no song running or it's not from youtube");
    }

};