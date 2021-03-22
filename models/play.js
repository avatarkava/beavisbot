module.exports = function (sequelize, DataTypes) {
  var Play = sequelize.define(
    "Play",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      site: { type: DataTypes.STRING },      
      positive: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      negative: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      grabs: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      listeners: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      skipped: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    },
    {
      underscored: true,
      tableName: "plays",
    }
  );

  Play.associate = function (models) {
    Play.belongsTo(models.Song);
    Play.belongsTo(models.User);
  };

  return Play;
};
