exports.names = ['reload'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 60;
exports.cdUser = 60;
exports.cdStaff = 60;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    loadCommands();
    loadResponses();
};

