module.exports = function (bot) {

    removeIfDownvoting = function (mehUsername) {

        var mehWaitList = bot.getWaitList();
        var mehUser = findUserInList(mehWaitList, mehUsername);

        if (config.verboseLogging) {
            console.log('[WAITLIST]' + JSON.stringify(mehWaitList, null, 2));
        }

        if (mehUser !== undefined && mehUser.vote == -1) {
            console.log('[REMOVE] Removed ' + mehUser.username + ' from wait list for mehing');
            var position = bot.getWaitListPosition(mehUser.id);
            bot.moderateRemoveDJ(mehUser.id);
            bot.sendChat('@' + mehUser.username + ', voting MEH/Chato/:thumbsdown: while in line is prohibited. Check .rules.');
            getDbUserFromSiteUser(mehUser.id, function (row) {
                var userData = {
                    type: 'remove',
                    details: 'Removed from position ' + position + ' for mehing',
                    user_id: row.id,
                    mod_user_id: botUser.db.id
                };
                models.Karma.create(userData);
            });
        }
    };

    monitorDJList = function () {

    }
};