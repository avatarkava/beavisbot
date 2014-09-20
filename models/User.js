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
        avatar_id: {type: Sequelize.STRING},
        badge: {type: Sequelize.STRING},
        blurb: {type: Sequelize.TEXT},
        global_role: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        role: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        level: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        experience_points: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        plug_points: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        joined: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        last_wait_list_position: {type: Sequelize.INTEGER, defaultValue: -1},
        last_seen: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        last_active: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
    }, {
        underscored: true,
        tableName: 'users'
    });
}