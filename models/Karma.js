module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Karma', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        type: {type: Sequelize.STRING, allowNull: false},
        details: {type: Sequelize.TEXT}
    }, {
        underscored: true,
        tableName: 'karmas'
    });
}