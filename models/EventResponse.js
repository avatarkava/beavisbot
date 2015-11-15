module.exports = function (sequelize, Sequelize) {
    return sequelize.define('EventResponse', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        event_type: {type: Sequelize.STRING, allowNull: false},
        trigger: {type: Sequelize.STRING},
        response: {type: Sequelize.STRING, allowNull: false},
        is_active: {type: Sequelize.BOOLEAN, defaultValue: true}
    }, {
        underscored: true,
        tableName: 'event_responses'
    });
}