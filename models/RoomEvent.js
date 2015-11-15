module.exports = function (sequelize, Sequelize) {
    return sequelize.define('RoomEvent', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        type: {type: Sequelize.STRING, allowNull: false},
        title: {type: Sequelize.STRING, allowNull: false},
        slug: {type: Sequelize.STRING, allowNull: false},
        details: {type: Sequelize.TEXT},
        starts_at: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
        ends_at: {type: Sequelize.DATE}
    }, {
        underscored: true,
        tableName: 'room_events',
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
}