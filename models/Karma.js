module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Karma', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true},
        //userId: {type: Sequelize.INTEGER.UNSIGNED, allowNull: false},
        type: {type: Sequelize.STRING, allowNull: false},
        details: {type: Sequelize.TEXT}
        //modUserId: {type: Sequelize.INTEGER.UNSIGNED}
    });
}