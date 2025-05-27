const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "visit_activity",
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      visit_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "visits",
          key: "visit_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      activity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "visit_activity",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "visit_activity_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
