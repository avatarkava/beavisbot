module.exports = function (sequelize, DataTypes) {
  var Blacklist = sequelize.define(
    "Blacklist",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      type: { type: DataTypes.STRING, allowNull: false },
      pattern: { type: DataTypes.STRING, allowNull: false },
      details: { type: DataTypes.TEXT },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    },
    {
      underscored: true,
      tableName: "blacklist",
    }
  );

  Blacklist.associate = function (models) {
    Blacklist.belongsTo(models.Song);
  };

  return Blacklist;
};
