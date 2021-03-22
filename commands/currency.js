exports.names = ['currency', 'points'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    if(config.customPointName) {

        var message = "Our custom currency is the " + config.customPointName + ". Points are free and " +
            "can be gifted by users or earned from " + bot.user.name + " by DJing or winning games. " +
            "Use .gift to give or .info to check your balance! Info on what " + config.customPointName +
            " can buy will be available soon!";
        bot.speak(message);
    }
};