module.exports = function (bot) {
    bot.on('modAddDJ', function (data) {
        console.log('[EVENT] modAddDJ ', JSON.stringify(data, null, 2));
    });
};
