"use strict";
module.exports = function (sequelize, DataTypes) {
    var Play = sequelize.define('Play', {
        id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        site_id: {type: DataTypes.STRING, allowNull: false},
        positive: {type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0},
        negative: {type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0},
        grabs: {type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0},
        listeners: {type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0},
        skipped: {type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0}
    }, {
        underscored: true,
        tableName: 'plays',
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });

    return Play;
}