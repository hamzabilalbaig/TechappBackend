const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "speed_test_task",
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      r_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      task_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      band: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sector_label: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      test_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Screenshot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      service_mode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      visit_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "visits",
          key: "visit_id",
        },
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date_updated: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "speed_test_task",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "speed_test_task_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
