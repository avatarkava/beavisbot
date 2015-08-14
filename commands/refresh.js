exports.names = ['.refresh'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = false;
exports.handler = function (data) {
    bot.sendChat('If you can not see the video, please click refresh on the video itself to select an alternate version (this may take more than one try!)');
}