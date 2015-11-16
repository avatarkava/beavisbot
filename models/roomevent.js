"use strict";
module.exports = function (sequelize, DataTypes) {
    var RoomEvent = sequelize.define('RoomEvent', {
        id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        type: {type: DataTypes.STRING, allowNull: false},
        title: {type: DataTypes.STRING, allowNull: false},
        slug: {type: DataTypes.STRING, allowNull: false},
        details: {type: DataTypes.TEXT},
        starts_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        ends_at: {type: DataTypes.DATE}
    }, {
        underscored: true,
        tableName: 'room_events',
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        },
        setterMethods: {
            title: function (v) {
                this.setDataValue('slug', S(v).slugify().s);
                return this.setDataValue('title', v);
            },
            slug: function (v) {
                return this.setDataValue('slug', S(v).slugify().s);
            }
        }
    });

    return RoomEvent;
}