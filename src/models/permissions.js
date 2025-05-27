const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permissions', {
    permission_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    permission_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'permissions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "permissions_pkey",
        unique: true,
        fields: [
          { name: "permission_id" },
        ]
      },
    ]
  });
};
