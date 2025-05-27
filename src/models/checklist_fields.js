const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('checklist_fields', {
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
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checked: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'checklist_fields',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "checklist_fields_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
