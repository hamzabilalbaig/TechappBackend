const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_pubacc_ra', {
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
      allowNull: true
    },
    unique_system_identifier: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      primaryKey: true
    },
    application_purpose: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    previous_purpose: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    input_source_code: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    status_code: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    date_entered: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    date_received: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    date_issued: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    date_constructed: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    date_dismantled: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    date_action: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    archive_flag_code: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    signature_first_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    signature_middle_initial: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    signature_last_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    signature_suffix: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    signature_title: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    invalid_signature: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    structure_street_address: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    structure_city: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    structure_state_code: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    county_code: {
      type: DataTypes.CHAR(5),
      allowNull: true
    },
    zip_code: {
      type: DataTypes.STRING(9),
      allowNull: true
    },
    height_of_structure: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ground_elevation: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    overall_height_above_ground: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    overall_height_amsl: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    structure_type: {
      type: DataTypes.CHAR(7),
      allowNull: true
    },
    date_faa_determination_issued: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    faa_study_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    faa_circular_number: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    specification_option: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    painting_and_lighting: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mark_light_code: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    mark_light_other: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    faa_emi_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    nepa_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    date_signed: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    signature_last_or: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    signature_first_or: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    signature_mi_or: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    signature_suffix_or: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    title_signed_or: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    date_signed_or: {
      type: DataTypes.CHAR(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_pubacc_ra',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "index_unq_tower_pubacc_ra",
        unique: true,
        fields: [
          { name: "registration_number" },
        ]
      },
      {
        name: "tower_pubacc_ra_pkey",
        unique: true,
        fields: [
          { name: "unique_system_identifier" },
        ]
      },
    ]
  });
};
