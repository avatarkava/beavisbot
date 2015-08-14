exports.names = ['.commands'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('Commands: ' + _.compact(_.map(commands, function (command) {
        if (command.enabled && !command.hidden && _.first(command.names) != '.commands') {
            return _.first(command.names);
        }
    })).join(', '));
};