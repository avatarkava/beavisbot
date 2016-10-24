module.exports = function (bot) {
    bot.on('followJoin', function (data) {
        console.log('[EVENT] followJoin ', JSON.stringify(data, null, 2));
    });
};