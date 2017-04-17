module.exports = function (sequelize, DataTypes) {
    var SongResponse = sequelize.define('SongResponse', {
        id: {type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        media_type: {type: DataTypes.STRING},
        pattern: {type: DataTypes.STRING, allowNull: false},
        response: {type: DataTypes.STRING},
        rate: {type: DataTypes.INTEGER, defaultValue: 0},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        underscored: true,
        tableName: 'song_responses',
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });

    return SongResponse;
}