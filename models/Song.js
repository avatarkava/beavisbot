module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Song', {
        id: {type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true},
        author: {type: Sequelize.STRING, allowNull: false},
        title: {type: Sequelize.STRING, allowNull: false},
        slug: {type: Sequelize.STRING, allowNull: false},
        release_date: {type: Sequelize.DATE},
        tags: {type: Sequelize.STRING},
        format: {type: Sequelize.INTEGER.UNSIGNED, defaultValue: 1},
        cid: {type: Sequelize.STRING, allowNull: false},
        plug_id: {type: Sequelize.INTEGER.UNSIGNED},
        duration: {type: Sequelize.INTEGER.UNSIGNED},
        image: {type: Sequelize.STRING},
        is_banned: {type: Sequelize.BOOLEAN, defaultValue: 0}
    }, {
        underscored: true,
        tableName: 'songs',
        setterMethods: {
            title: function (v) {
                var formattedSlug = S(this.getDataValue('author') + '-' + v).slugify().s;
                this.setDataValue('slug', formattedSlug);
                return this.setDataValue('title', v);
            },
            slug: function (v) {
                return this.setDataValue('slug', S(v).slugify().s);
            }
        }
    });
}