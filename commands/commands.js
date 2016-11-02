exports.names = ['commands'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    bot.sendChat('Commands: ' + _.compact(_.map(commands, function (command) {
        if (command.enabled && !command.hidden && _.first(command.names) != 'commands') {
            return config.commandLiteral + _.first(command.names);
        }
    })).join(', '));
};