exports.names = ['reload'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 60;
exports.cdUser = 60;
exports.cdStaff = 60;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {

    // Reload the last existing state of the config file, otherwise revert to the default
    if (fs.existsSync(dpath.resolve(__dirname, '../configState.json'))) {
        config = reload(dpath.resolve(__dirname, '../configState.json'));
        console.log('Loaded config file from ' + dpath.resolve(__dirname, '../configState.json'));
    } else {
        config = reload(dpath.resolve(__dirname, '../config.json'));
        console.log('Loaded config file from ' + dpath.resolve(__dirname, '../config.json'));
        writeConfigState();
    }

    // @TODO - Find a way to reload the events (bot.on bindings need to be purged and reset)
    // loadEvents(bot);

    loadCommands(bot);
    loadExtensions(bot);
    bot.sendChat(':robot_face: Commands and config reloaded, @' + data.from.username + '!');
};

