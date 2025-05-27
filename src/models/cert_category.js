const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cert_category', {
    cert_category_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    cert_category_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_category_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_category_policy: {
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
    },
    enabled_badge: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disabled_badge: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cert_category',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cert_category_pkey",
        unique: true,
        fields: [
          { name: "cert_category_id" },
        ]
      },
    ]
  });
};
