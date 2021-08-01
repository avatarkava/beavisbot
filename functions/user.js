module.exports = function () {
  // Case-insensitive search for user
  findUserInList = function (list, username) {
    var lowerUser = username.toLowerCase();
    return _.find(list, function (term) {
      return term.username.toLowerCase() == lowerUser;
    });
  };

  getDbUserFromUserId = function (siteUserId, callback) {
    models.User.findOne({
      where: { site_id: siteUserId, site: config.site },
    }).then(function (row) {
      callback(row);
    });
  };

  getDbUserFromUsername = function (siteUsername, callback) {
    models.User.findOne({
      where: { username: siteUsername, site: config.site },
      order: "id ASC",
    }).then(function (row) {
      callback(row);
    });
  };

  hasPermission = function (user, minRole) {
    // @FIXME We aren't checking anything yet!!!
    return true;
    /*
    if (user.role == PlugAPI.ROOM_ROLE.RESIDENTDJ) {
      return user.role >= minRole || (minRole == PERMISSIONS.RDJ_PLUS && settings["rdjplus"]);
    } else if (user.role == PlugAPI.ROOM_ROLE.BOUNCER) {
      return user.role >= minRole || (minRole == PERMISSIONS.BOUNCER_PLUS && settings["bouncerplus"]);
    }

    return user.role >= minRole;
    */
  };

  getUsers = function () {
    return [];
  };

  getWaitListPosition = function (userId) {
    return -1;
  };

  saveWaitList = function (wholeRoom) {
    if (wholeRoom) {
      var userList = bot.getUsers();
    } else {
      var userList = bot.getWaitList();
    }
    userList.forEach(function (user) {
      var position = bot.getWaitListPosition(user.id);
      // user last seen in 900 seconds
      if (position > 0) {
        models.User.update(
          {
            queue_position: position,
            last_seen: moment.utc().toDate(),
          },
          { where: { site: config.site, site_id: user.id.toString() } }
        );
      } else {
        models.User.update({ queue_position: -1 }, { where: { site: config.site, site_id: user.id.toString() } });
      }

      if (config.verboseLogging) {
        console.log("[WL-UPDATE]", user.username + " => " + position);
      }
    });
    models.User.update(
      { queue_position: -1 },
      {
        where: {
          last_seen: { lte: moment.utc().subtract(15, "minutes").toDate() },
          last_active: { lte: moment.utc().subtract(15, "minutes").toDate() },
          queue_position: { ne: -1 },
        },
      }
    );
  };

  updateDbUser = function (user) {
    if (user.name == "Guest") return;

    const userData = {
      site: config.site,
      site_id: user.userid,
      username: user.name,
      avatar: user.avatarid,
      role: user.acl,
      site_points: user.points,
      last_seen: new Date(),
    };

    models.User.findOrCreate({
      where: { site_id: user.userid, site: config.site },
      defaults: userData,
    })
      .then(([dbUser, created]) => {
        // Save the alias if the user has changed username
        if (dbUser.username && userData.username != dbUser.username) {
          console.log("[USER]", userData.username + " has changed their username from " + dbUser.username + ". Saving alias...");
          addAlias(dbUser.dataValues);
        }

        // Reset the user's AFK timer if they've been gone for long enough (so we don't reset on disconnects)        
        if (secondsSince(dbUser.last_seen) >= 900) {
          dbUser.last_active = new Date();
          dbUser.queue_position = getWaitListPosition(user.userid);
        }

        dbUser.username = userData.username;
        dbUser.last_seen = new Date();
        return dbUser.save();
      })
      .catch((err) => {
        console.log("[ERROR]", err);
      });
  };

  addAlias = function (user) {
    models.UserAlias.upsert({
      username: user.username,
      user_id: user.id,
    }).catch(function (err) {
      console.log("[ERROR]", err);
    });
  };
};
