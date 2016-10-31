exports.names = ['reload'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 60;
exports.cdUser = 60;
exports.cdStaff = 60;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {

    config = require(dpath.resolve(__dirname, '../config.json'));

    loadEvents(bot);
    loadCommands(bot);
    loadExtensions(bot);
};

