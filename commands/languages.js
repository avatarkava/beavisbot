exports.names = ['languages'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {

    // @FIXME - This probably needs to store in the db and get set from user.userInfo.locale

    console.log(bot.getUsers());
    return;

    language_array = _.pluck(bot.getUsers(), 'language');
    languages = {}

    for (i = 0; i < language_array.length; i++) {
        languages[language_array[i]] = languages[language_array[i]] ? languages[language_array[i]] + 1 : 1;
    }

    bot.sendChat(_.map(_.sortBy(_.pairs(languages), function (lang) {
        return -lang[1];
    }), function (pair) {
        return (iso_languages[pair[0]] ? iso_languages[pair[0]] : pair[0]) + ': ' + pair[1] + (pair[1] == 1 ? ' user' : ' users')
    }).join(' · '));
};