module.exports = function (bot) {
    bot.on('boothLocked', function (data) {
        console.log('[EVENT] boothLocked ', JSON.stringify(data, null, 2));
    });
};