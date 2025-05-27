const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_pubacc_ec', {
    id:{
      type: DataTypes.VIRTUAL,
      primaryKey: true,
    },
    record_type: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    content_indicator: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    file_number: {
      type: DataTypes.CHAR(8),
      allowNull: true
    },
    registration_number: {
      type: DataTypes.CHAR(7),
      allowNull: true,
      unique: "unq_tower_pubacc_ec_registration_number"
    },
    unique_system_identifier: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      references: {
        model: 'tower_pubacc_ra',
        key: 'unique_system_identifier'
      },
      unique: "unq_tower_pubacc_ec_unique_system_identifier"
    },
    waiver_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    other_federal_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    fed_lands_type: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    fed_agency_name: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    national_notice_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    env_assessment_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    env_cert_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    env_cert_basis: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    local_notice_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_pubacc_ec',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "unq_tower_pubacc_ec_registration_number",
        unique: true,
        fields: [
          { name: "registration_number" },
        ]
      },
      {
        name: "unq_tower_pubacc_ec_unique_system_identifier",
        unique: true,
        fields: [
          { name: "unique_system_identifier" },
        ]
      },
    ]
  });
};
