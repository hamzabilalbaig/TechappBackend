const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cert_type', {
    cert_type_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    cert_category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'cert_category',
        key: 'cert_category_id'
      }
    },
    cert_type_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_type_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_type_policy: {
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
    equivalent_type_id:{
      type: DataTypes.BIGINT,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'cert_type',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cert_type_pkey",
        unique: true,
        fields: [
          { name: "cert_type_id" },
        ]
      },
    ]
  });
};
