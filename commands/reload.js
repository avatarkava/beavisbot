exports.names = ['reload'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 60;
exports.cdUser = 60;
exports.cdStaff = 60;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {

    config = reload(dpath.resolve(__dirname, '../config.json'));

    // @TODO - Find a way to reload the events (bot.on bindings need to be purged and reset)
    // loadEvents(bot);

    loadCommands(bot);
    loadExtensions(bot);
    bot.sendChat(':robot_face: Commands and config reloaded, @' + data.from.username + '!');
};

