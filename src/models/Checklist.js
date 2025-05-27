const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Checklist",
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      checked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      table_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      table_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      tableName: "Checklist",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "Checklist_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
