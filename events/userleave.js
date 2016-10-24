module.exports = function (bot) {
    bot.on('userLeave', function (data) {
        console.log('[LEAVE]', 'User left: ' + data.username);
        models.User.update({last_leave: new Date()}, {where: {site: config.site, site_id: data.id.toString()}});
    });
};
