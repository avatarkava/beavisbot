module.exports = function (bot) {
    bot.on('modRemoveDJ', function (data) {
        console.log('[EVENT] modRemoveDJ ', JSON.stringify(data, null, 2));
        saveWaitList(true);
    });
};