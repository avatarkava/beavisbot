exports.names = ['refresh'];
exports.hidden = false;
exports.enabled = false;
exports.matchStart = false;
exports.handler = function (data) {
    // @TODO - No functionality for this in plug
    bot.sendChat('If you can not see the video, please click refresh on the video itself to select an alternate version (this may take more than one try!)');
}