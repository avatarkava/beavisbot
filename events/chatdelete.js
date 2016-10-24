module.exports = function (bot) {
    bot.on('chatDelete', function (data) {
        console.log('[EVENT] chatDelete ', JSON.stringify(data, null, 2));
    });
};