exports.names = ['delay'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 1800;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {

    var input = data.message.split(' ');
    var spots = 1;

    if (input.length == 2) {
        spots = Math.abs(parseInt(input[1]));
    }

    var position = bot.getWaitListPosition(data.from.id);
    if (position > 0) {
        var newPosition = position + spots;
        bot.moderateMoveDJ(data.from.id, newPosition);
        console.log('[MOVE]', 'Moving ' + data.from.username + ' to position: ' + newPosition + ' (requested delay)');
        bot.sendChat('/me Moved you down the wait list @' + data.from.username + '. You can request another delay after 30 minutes.');
    }

}