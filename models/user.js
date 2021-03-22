module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      site: { type: DataTypes.STRING, allowNull: false, defaultValue: "turntable", unique: "site_id" },
      site_id: { type: DataTypes.STRING, allowNull: false, unique: "site_id" },
      username: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      locale: { type: DataTypes.STRING, defaultValue: "en_US" },
      avatar: { type: DataTypes.STRING },
      badge: { type: DataTypes.STRING },
      bio: { type: DataTypes.TEXT },
      role: { type: DataTypes.STRING },
      site_points: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      custom_points: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      joined: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      birthday: { type: DataTypes.DATEONLY },
      queue_position: { type: DataTypes.INTEGER, defaultValue: -1 },
      last_seen: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      last_active: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      last_leave: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      dj_timeout_until: { type: DataTypes.DATE, allowNull: true },
    },
    {
      underscored: true,
      tableName: "users",
      setterMethods: {
        username: function (v) {
          this.setDataValue("slug", S.slugify(v));
          return this.setDataValue("username", v);
        },
        slug: function (v) {
          return this.setDataValue("slug", S.slugify(v));
        },
      },
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Game, { as: "UserGames", foreignKey: "user_id" });
    User.hasMany(models.Game, { as: "ModUserGames", foreignKey: "mod_user_id" });
    User.hasMany(models.Karma, { as: "UserKarmas", foreignKey: "user_id" });
    User.hasMany(models.Karma, { as: "ModUserKarmas", foreignKey: "mod_user_id" });
    User.hasMany(models.Play, { as: "UserPlays", foreignKey: "user_id" });
    User.hasMany(models.RoomEvent, { as: "ModUserRoomEvents", foreignKey: "mod_user_id" });
    User.hasMany(models.UserAlias, { as: "UserAliases", foreignKey: "user_id"});
  };

  return User;
};
