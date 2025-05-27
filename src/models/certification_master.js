const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('certification_master', {
    certmaster_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    provider_certifications_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_issue_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cert_expire_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cert_master_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verification_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    verification_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verified_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    approved_to_climb: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    cert_status: {
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
    }
  }, {
    sequelize,
    tableName: 'certification_master',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "certification_master_pkey",
        unique: true,
        fields: [
          { name: "certmaster_id" },
        ]
      },
    ]
  });
};
