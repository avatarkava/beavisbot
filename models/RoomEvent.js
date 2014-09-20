module.exports = function (sequelize, Sequelize) {
    return sequelize.define('RoomEvent', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        type: {type: Sequelize.STRING, allowNull: false},
        title: {type: Sequelize.STRING, allowNull: false},
        slug: {
            type: Sequelize.STRING,
            allowNull: false,
            set: function (v) {
                // @todo - slugify the string
            }
        },
        details: {type: Sequelize.TEXT},
        starts_at: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        ends_at: {type: Sequelize.DATE}
    }, {
        underscored: true,
        tableName: 'room_events'
    });
}