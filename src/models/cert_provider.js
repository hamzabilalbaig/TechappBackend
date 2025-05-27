const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cert_provider', {
    cert_provider_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    cert_provider_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_provider_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_provider_policy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cert_provider',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cert_provider_pkey",
        unique: true,
        fields: [
          { name: "cert_provider_id" },
        ]
      },
    ]
  });
};
