module.exports = function (sequelize, DataTypes) {
  var EventResponse = sequelize.define(
    "EventResponse",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      event_type: { type: DataTypes.STRING, allowNull: false },
      pattern: { type: DataTypes.STRING },
      response: { type: DataTypes.STRING, allowNull: false },
      cooldown: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 30 },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      underscored: true,
      tableName: "event_responses",
    }
  );

  return EventResponse;
};
