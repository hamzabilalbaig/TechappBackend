const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project_sites_mappings', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'project_id'
      },
      unique: "project_sites_mappings_unique"
    },
    site_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'site',
        key: 'site_id'
      },
      unique: "project_sites_mappings_unique"
    }
  }, {
    sequelize,
    tableName: 'project_sites_mappings',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "project_sites_mappings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "project_sites_mappings_unique",
        unique: true,
        fields: [
          { name: "project_id" },
          { name: "site_id" },
        ]
      },
    ]
  });
};
