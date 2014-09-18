module.exports = function (sequelize, Sequelize) {
    return sequelize.define('User', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true},
        username: {type: Sequelize.STRING, allowNull: false},
        slug: {
            type: Sequelize.STRING,
            allowNull: false,
            set: function (v) {
                // @todo - slugify the string
            }
        },
        language: {type: Sequelize.STRING, defaultValue: 'en'},
        avatarId: {type: Sequelize.STRING},
        badge: {type: Sequelize.STRING},
        blurb: {type: Sequelize.TEXT},
        globalRole: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        role: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        level: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        experiencePoints: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        plugPoints: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        joined: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        lastWaitListPosition: {type: Sequelize.INTEGER, defaultValue: -1},
        lastSeen: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        lastActive: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
    });
}