exports.names = ['locales'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 30;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var userList = _.pluck(bot.getUsers(), 'id');
    var users = [];

    models.User.findAll({
        attributes: ['locale', [Sequelize.fn('count', Sequelize.col('locale')), 'user_count']],
        where: {site_id: {$in: userList}, site: config.site},
        group: ['locale'],
        raw: true
    }).then(function (rows) {
        for (var x in rows) {
            if (rows[x].locale !== 'null' && rows[x].user_count > 0) {
                users.push(rows[x].locale + ': ' + rows[x].user_count);
            }
        }
        bot.sendChat(users.join(' · '));
    });

    // @TODO - Translate and use some iso_languages from context.js
    //iso_languages[pair[0]] ? iso_languages[pair[0]]
};