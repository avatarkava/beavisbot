module.exports = function (sequelize, Sequelize) {
    return sequelize.define('SongResponse', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        media_type: {type: Sequelize.STRING},
        trigger: {type: Sequelize.STRING, allowNull: false},
        response: {type: Sequelize.STRING},
        rate: {type: Sequelize.INTEGER, defaultValue: 0},
        is_active: {type: Sequelize.BOOLEAN, defaultValue: true}
    }, {
        underscored: true,
        tableName: 'song_responses'
    });
}