module.exports = function (bot) {
    bot.on('modMoveDJ', function (data) {
        console.log('[EVENT] modMoveDJ ', JSON.stringify(data, null, 2));
    });
};
