const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "detail_code",
    {
      detail_code_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      master_code_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "master_code",
          key: "master_code_id",
        },
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "detail_code",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "detail_code_pkey",
          unique: true,
          fields: [{ name: "detail_code_id" }],
        },
      ],
    }
  );
};
