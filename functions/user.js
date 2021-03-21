module.exports = function () {  

  // Case-insensitive search for user
  findUserInList = function (list, username) {
    var lowerUser = username.toLowerCase();
    return _.find(list, function (term) {
      return term.username.toLowerCase() == lowerUser;
    });
  };

  getDbUserFromSiteUser = function (siteUser, callback) {
    models.User.find({
      where: { site_id: siteUser.id.toString(), site: config.site },
    }).then(function (row) {
      callback(row);
    });
  };

  getDbUserFromUsername = function (siteUsername, callback) {
    models.User.find({
      where: { username: siteUsername, site: config.site },
      order: "id ASC",
    }).then(function (row) {
      callback(row);
    });
  };

  hasPermission = function (user, minRole) {
    // @FIXME We aren't checking anything yet!!!
    return true;
    if (user.role == PlugAPI.ROOM_ROLE.RESIDENTDJ) {
      return (
        user.role >= minRole ||
        (minRole == PERMISSIONS.RDJ_PLUS && settings["rdjplus"])
      );
    } else if (user.role == PlugAPI.ROOM_ROLE.BOUNCER) {
      return (
        user.role >= minRole ||
        (minRole == PERMISSIONS.BOUNCER_PLUS && settings["bouncerplus"])
      );
    }

    return user.role >= minRole;
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
        models.User.update(
          { queue_position: -1 },
          { where: { site: config.site, site_id: user.id.toString() } }
        );
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
    var userData = {
      site: config.site,
      site_id: user.id,
      username: user.username,
      slug: user.slug,
      language: user.language,
      avatar: user.avatarID,
      badge: user.badge,
      bio: user.blurb,
      role: user.role,
      site_points: user.level,
      last_seen: new Date(),
    };

    models.User.findOrCreate({
      where: { site_id: user.id, site: config.site },
      defaults: userData,
    })
      .spread(function (dbUser) {
        // Set join date to be the first time we see the user in our room
        if (dbUser.joined === undefined) {
          userData.joined = new Date();
        }

        // Save the alias if the user has changed username
        if (userData.username != dbUser.username) {
          console.log(
            "[USER]",
            userData.username +
              " has changed their username from " +
              dbUser.username +
              ". Saving alias..."
          );
          addAlias(dbUser);
        }

        // Reset the user's AFK timer if they've been gone for long enough (so we don't reset on disconnects)
        if (secondsSince(dbUser.last_seen) >= 900) {
          userData.last_active = new Date();
          userData.queue_position = bot.getWaitListPosition(user.id);
        }
        dbUser.updateAttributes(userData);
      })
      .catch(function (err) {
        console.log("[ERROR]", err);
      });
  };

  addAlias = function (user) {
    models.UserAlias.create({
      username: user.username,
      user_id: user.id,
    }).catch(function (err) {
      console.log("[ERROR]", err);
    });
  };
  
};
