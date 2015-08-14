module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Play', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        positive: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        negative: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        grabs: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        listeners: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0},
        skipped: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0}
    }, {
        underscored: true,
        tableName: 'plays'
    });
}