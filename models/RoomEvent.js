module.exports = function(sequelize, Sequelize) {
    return sequelize.define('RoomEvent', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true},
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
        startsAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        endsAt: {type: Sequelize.DATE}
    });
}