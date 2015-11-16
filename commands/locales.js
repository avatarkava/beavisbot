exports.names = ['locales'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {

    var userList = _.pluck(bot.getUsers(), 'id');
    var users = [];

    models.User.findAll({
        attributes: ['locale', [Sequelize.fn('count', Sequelize.col('locale')), 'user_count']],
        where: {site_id: {$in: userList}},
        group: ['locale'],
        raw: true
    }).then(function (rows) {
        for (var x in rows) {
            users.push(rows[x].locale + ': ' + rows[x].user_count);
        }
        bot.sendChat(users.join(' · '));
    });

    // @TODO - Translate and use some iso_languages from context.js
    //iso_languages[pair[0]] ? iso_languages[pair[0]]
};