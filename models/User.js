module.exports = function (sequelize, Sequelize) {
    return sequelize.define('User', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true},
        username: {type: Sequelize.STRING, allowNull: false},
        slug: {type: Sequelize.STRING, allowNull: false},
        language: {type: Sequelize.STRING, defaultValue: 'en'},
        avatar_id: {type: Sequelize.STRING},
        badge: {type: Sequelize.STRING},
        blurb: {type: Sequelize.TEXT},
        global_role: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        role: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        level: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        experience_points: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        plug_points: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        custom_points: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        joined: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        birthday: {type: Sequelize.DATE},
        waitlist_position: {type: Sequelize.INTEGER, defaultValue: -1},
        last_seen: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        last_active: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
    }, {
        underscored: true,
        tableName: 'users',
        setterMethods: {
            username: function (v) {
                this.setDataValue('slug', S(v).slugify().s);
                return this.setDataValue('username', v);
            },
            slug: function (v) {
                return this.setDataValue('slug', S(v).slugify().s);
            }
        }
    });
}