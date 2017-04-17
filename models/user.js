module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        site: {type: DataTypes.STRING, allowNull: false, defaultValue: 'plug', unique: 'site_id'},
        site_id: {type: DataTypes.STRING, allowNull: false, unique: 'site_id'},
        username: {type: DataTypes.STRING, allowNull: false},
        slug: {type: DataTypes.STRING, allowNull: false},
        locale: {type: DataTypes.STRING, defaultValue: 'en_US'},
        avatar: {type: DataTypes.STRING},
        badge: {type: DataTypes.STRING},
        bio: {type: DataTypes.TEXT},
        role: {type: DataTypes.STRING},
        site_points: {type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0},
        custom_points: {type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0},
        joined: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        birthday: {type: DataTypes.DATEONLY},
        queue_position: {type: DataTypes.INTEGER, defaultValue: -1},
        last_seen: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        last_active: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        last_leave: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
    }, {
        underscored: true,
        tableName: 'users',
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Game, {as: 'User', foreignKey: 'user_id'});
                User.hasMany(models.Game, {as: 'ModUser', foreignKey: 'mod_user_id'});
                User.hasMany(models.Karma);
                User.hasMany(models.Karma, {as: 'ModUser', foreignKey: 'mod_user_id'});
                User.hasMany(models.Play);
                User.hasMany(models.RoomEvent, {as: 'ModUser', foreignKey: 'mod_user_id'});
            }
        },
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

    return User;
}