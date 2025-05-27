const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "issues",
    {
      issue_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      visit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "visits",
          key: "visit_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      site_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "site",
          key: "site_id",
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      issue_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issue_severity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issue_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resolution_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      resolution_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resolution_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issue_owner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issue_created_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issue_modified_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issue_created_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      issue_modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      issue_approved_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      issue_approved_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "issues",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "issues_pkey",
          unique: true,
          fields: [{ name: "issue_id" }],
        },
      ],
    }
  );
};
