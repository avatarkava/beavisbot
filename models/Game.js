module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Game', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        type: {type: Sequelize.STRING, allowNull: false},
        details: {type: Sequelize.TEXT},
        result: {type: Sequelize.TEXT},
        participants: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0}
    }, {
        underscored: true,
        tableName: 'games'
    });
}