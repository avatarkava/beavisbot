module.exports = function (sequelize, DataTypes) {
  var Song = sequelize.define(
    "Song",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },      
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING },
      title: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      release_date: { type: DataTypes.DATEONLY },
      tags: { type: DataTypes.STRING },
      host: { type: DataTypes.STRING, allowNull: false, defaultValue: "youtube" },
      host_id: { type: DataTypes.STRING, allowNull: false },
      permalink: { type: DataTypes.STRING },
      duration: { type: DataTypes.INTEGER.UNSIGNED },
      image: { type: DataTypes.STRING },
      is_banned: { type: DataTypes.BOOLEAN, defaultValue: 0 },
      banned_reason: { type: DataTypes.STRING },
    },
    {
      underscored: true,
      tableName: "songs",
      indexes: [
        { unique: true, fields: ['host', 'host_id'] }
      ],
      setterMethods: {
        name: function (v) {
          var formattedSlug = slugify(v, {lower: true});
          this.setDataValue("slug", formattedSlug);
          return this.setDataValue("name", v);
        },
        slug: function (v) {
          return this.setDataValue("slug", slugify(v, {lower: true}));
        },
      },
    }
  );

  Song.associate = function (models) {
    Song.hasMany(models.Play);
  };

  return Song;
};
