const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('checklist_files', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    checklist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Checklist',
        key: 'id'
      }
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_ext: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'checklist_files',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "checklist_files_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
