module.exports = function (bot) {
    bot.on('modUnban', function (data) {
        if (config.verboseLogging) {
            console.log('[EVENT] modUnban ', JSON.stringify(data, null, 2));
        }
        var message = '[UNBAN] ' + data.username + ' was unbanned by ' + data.moderator;
        console.log(message);
        sendToSlack(message);
    });
};
