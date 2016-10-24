module.exports = function (bot) {
    bot.on('roomMinChatLevelUpdate', function (data) {
        console.log('[EVENT] roomMinChatLevelUpdate ', JSON.stringify(data, null, 2));
    });
};
