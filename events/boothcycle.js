module.exports = function (bot) {
    bot.on('boothCycle', function (data) {
        console.log('[EVENT] boothCycle ', JSON.stringify(data, null, 2));
    });
};