const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projects', {
    project_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    project_startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    project_endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    company: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'customer_id'
      }
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'projects',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "projects_pkey",
        unique: true,
        fields: [
          { name: "project_id" },
        ]
      },
    ]
  });
};
