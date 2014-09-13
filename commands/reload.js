exports.names = ['.reload','.reboot','.restart'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.log(JSON.stringify(room.users, null, 2));;
    if (_.findWhere(room.users, {id: data.uid}).role > 1) {
        bot.sendChat("http://media.giphy.com/media/PllNNHVRrlVJe/giphy.gif");
        bot.log('[KILL] Bot killed by ' + data.un);
        setTimeout(function () {
            process.exit(1);
        }, 3000);
    }
}