module.exports = function(sequelize, Sequelize) {
    return sequelize.define('EventResponse', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true},
        trigger: {type: Sequelize.STRING, allowNull: false},
        response: {type: Sequelize.STRING, allowNull: false},
        isActive: {type: Sequelize.BOOLEAN, defaultValue: true}
    });
}