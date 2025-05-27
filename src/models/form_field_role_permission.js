const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('form_field_role_permission', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    field_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'form_fields',
        key: 'field_id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'role_id'
      }
    },
    form_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_editable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'form_field_role_permission',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "form_field_role_permission_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
