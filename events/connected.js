module.exports = function (bot) {
    bot.on('connected', function () {
        console.log('Connected!');
    });
};