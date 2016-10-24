module.exports = function (bot) {
    bot.on('error', function (msg, trace) {
        console.log("Got an error from the virtual browser: ", msg, trace);
    });
};