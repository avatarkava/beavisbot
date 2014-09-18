module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Quote', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true},
        category: {type: Sequelize.STRING, allowNull: false},
        text: {type: Sequelize.STRING, allowNull: false},
        isActive: {type: Sequelize.BOOLEAN, defaultValue: true}
    });
}