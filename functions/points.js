module.exports = function (bot) {

    attemptPurchase = function (user, points) {

        getDbUserFromSiteUser(user, function (row) {
            if (!row || row.custom_points < points) {
                console.log('[POINTS] Purchase failed: ' + row.username + ' only has ' + row.custom_points + ' points (' + points + ' needed)');
                bot.sendChat('Sorry @' + row.username + ', you need ' + points + config.customPointName + ' for that.');
                return false;
            }

            // Deduct the points from the sender's balance and add to the recipient
            models.User.update({custom_points: Sequelize.literal('(custom_points - ' + points + ')')}, {where: {site_id: row.site_id}});

            console.log('[POINTS] ' + row.username + '  spent ' + points + ' points');
            return true;
        });

    }

    transferCustomPoints = function (fromUser, toUser, points) {

        // Create them out of thin air!
        if (fromUser === null) {
            fromUser = bot.getSelf();

            models.User.update({custom_points: Sequelize.literal('(custom_points + ' + points + ')')}, {where: {site_id: toUser.id.toString()}});
            console.log('[GIFT] ' + fromUser.username + ' awarded ' + points + ' points to ' + toUser.username);
            bot.sendChat(':gift: ' + fromUser.username + ' awarded ' + points + ' ' + config.customPointName + ' to @' +
                toUser.username);

            return;
        }
        else {
            getDbUserFromSiteUser(fromUser, function (row) {
                if (!row || row.custom_points < points) {
                    console.log('Gift failed');
                    return false;
                }

                // Deduct the points from the sender's balance and add to the recipient
                models.User.update({custom_points: Sequelize.literal('(custom_points - ' + points + ')')}, {where: {site_id: fromUser.id.toString()}});
                models.User.update({custom_points: Sequelize.literal('(custom_points + ' + points + ')')}, {where: {site_id: toUser.id.toString()}});

                console.log('[GIFT] ' + fromUser.username + ' gave ' + points + ' points to ' + toUser.username);
                bot.sendChat(':gift: @' + fromUser.username + ' gave ' + points + ' ' + config.customPointName + ' to @' +
                    toUser.username + ' :gift:');

            });
        }
    };
};