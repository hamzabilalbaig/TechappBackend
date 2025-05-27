const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "tickets",
    {
      ticket_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "projects",
          key: "project_id",
        },
      },
      ticket_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      site_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "site",
          key: "site_id",
        },
      },
      is_valid:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      status:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_new: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "tickets",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "tickets_pkey",
          unique: true,
          fields: [{ name: "ticket_id" }],
        },
      ],
    }
  );
};
