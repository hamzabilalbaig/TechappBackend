const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cert_types_providers', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    cert_type_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'cert_type',
        key: 'cert_type_id'
      }
    },
    cert_provider_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'cert_provider',
        key: 'cert_provider_id'
      }
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cert_types_providers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cert_types_providers_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
