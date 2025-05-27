const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_pubacc_de', {
    id:{
      type: DataTypes.VIRTUAL,
      primaryKey: true,
    },
    record_type: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    faa_study_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "unq_tower_pubacc_de_faa_study_number"
    },
    circular_number: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    latitude_degrees: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    latitude_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    latitude_seconds: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    latitude_direction: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    latitude_total_seconds: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    longitude_degrees: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    longitude_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    longitude_seconds: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    longitude_direction: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    longitude_total_seconds: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    height_ground_elevation: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    height_overall_structure: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    height_overall_amsl: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    faa_date_issued: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    faa_date_keyed: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    faa_date_expiration: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    date_action: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    date_faa_final: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    state_code: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    business_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    middle_initial: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    suffix: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    faa_emi_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_pubacc_de',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "unq_tower_pubacc_de_faa_study_number",
        unique: true,
        fields: [
          { name: "faa_study_number" },
        ]
      },
    ]
  });
};
