const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permissions_roles', {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'role_id'
      }
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'permissions',
        key: 'permission_id'
      }
    },
    Create: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Update: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Delete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'permissions_roles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "permissions_roles_pkey",
        unique: true,
        fields: [
          { name: "role_id" },
          { name: "permission_id" },
        ]
      },
    ]
  });
};
