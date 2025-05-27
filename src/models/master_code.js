const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "master_code",
    {
      master_code_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "master_code",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "master_code_pkey",
          unique: true,
          fields: [{ name: "master_code_id" }],
        },
      ],
    }
  );
};
