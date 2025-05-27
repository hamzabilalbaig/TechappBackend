const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "form_fields",
    {
      field_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      form_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "forms",
          key: "form_id",
        },
      },
      field_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      field_label: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      error_message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      tooltip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      field_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      section: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      component_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "form_fields",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "form_fields_pkey",
          unique: true,
          fields: [{ name: "field_id" }],
        },
      ],
    }
  );
};
