module.exports = function(sequelize, Sequelize) {
    return sequelize.define('Song', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true},
        author: {type: Sequelize.STRING, allowNull: false},
        title: {type: Sequelize.STRING, allowNull: false},
        slug: {
            type: Sequelize.STRING,
            allowNull: false,
            set: function (v) {
                // @todo - slugify the string
            }
        },
        releaseDate: {type: Sequelize.DATE},
        tags: {type: Sequelize.STRING},
        format: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 1},
        cid: {type: Sequelize.STRING, allowNull: false, unique: true},
        duration: {type: Sequelize.INTEGER.UNSIGNED},
        image: {type: Sequelize.STRING},
        isBanned: {type: Sequelize.BOOLEAN, defaultValue: 0}
    });
}