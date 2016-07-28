exports.names = ['reload'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.cdAll = 0;
exports.cdUser = 0;
exports.cdStaff = 60;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    loadCommands();
    loadResponses();
};

