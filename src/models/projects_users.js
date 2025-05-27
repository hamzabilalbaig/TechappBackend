const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "projects_users",
    {
      projects_users_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
        references: {
          model: "projects",
          key: "project_id",
        },
      },
    },
    {
      sequelize,
      tableName: "projects_users",
      schema: "public",
      timestamps: false,
    }
  );
};
