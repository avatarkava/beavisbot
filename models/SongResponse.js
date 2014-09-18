module.exports = function(sequelize, Sequelize) {
    return sequelize.define('SongResponse', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true},
        media_type: {type: Sequelize.STRING},
        trigger: {type: Sequelize.STRING, allowNull: false},
        response: {type: Sequelize.STRING},
        rate: {type: Sequelize.INTEGER, defaultValue: 0},
        isActive: {type: Sequelize.BOOLEAN, defaultValue: true}
    });
}