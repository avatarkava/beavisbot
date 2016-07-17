"use strict";
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('EventResponse', {
        id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        event_type: {type: DataTypes.STRING, allowNull: false},
        pattern: {type: DataTypes.STRING},
        response: {type: DataTypes.STRING, allowNull: false},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        underscored: true,
        tableName: 'event_responses',
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });

    return EventResponse;
}