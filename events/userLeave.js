module.exports = function (bot) {

    bot.on(PlugAPI.events.USER_LEAVE, function (data) {

        if (config.verboseLogging) {
            console.log('[EVENT] userLeave', data);
        }        
        console.log('[LEAVE]', 'User left: ' + data.username);
        models.User.update({last_leave: new Date()}, {where: {site: config.site, site_id: data.id.toString()}});
    });
};
