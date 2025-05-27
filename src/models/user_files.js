const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "user_files",
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      folder_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      file_size: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date_created: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      date_updated: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "user_files",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "user_files_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
