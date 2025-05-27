const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_pubacc_rs', {
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
      unique: "unq_tower_pubacc_rs_registration_number"
    },
    unique_system_identifier: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      references: {
        model: 'tower_pubacc_ra',
        key: 'unique_system_identifier'
      },
      unique: "unq_tower_pubacc_rs_unique_system_identifier"
    },
    reason_type: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    reason_description: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    reason_comment: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reason_date: {
      type: DataTypes.CHAR(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_pubacc_rs',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "unq_tower_pubacc_rs_registration_number",
        unique: true,
        fields: [
          { name: "registration_number" },
        ]
      },
      {
        name: "unq_tower_pubacc_rs_unique_system_identifier",
        unique: true,
        fields: [
          { name: "unique_system_identifier" },
        ]
      },
    ]
  });
};
