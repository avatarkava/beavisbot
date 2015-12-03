exports.names = ['currency', 'points'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    if(config.customPointName) {

        botUser = bot.getSelf();
        var message = "Our custom point/currency is the " + config.customPointName + ". Points are totally free and " +
            "can be gifted by room users or earned from " + botUser.username + " by DJing or winning games. " +
            "Use .gift or .info to give or check your balance! Information on what " + config.customPointName +
            " can buy will be available soon!";
        bot.sendChat(message);
    }
};