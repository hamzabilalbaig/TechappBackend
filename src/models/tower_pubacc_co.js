const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_pubacc_co', {
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
      allowNull: false
    },
    unique_system_identifier: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      references: {
        model: 'tower_pubacc_ra',
        key: 'unique_system_identifier'
      }
    },
    coordinate_type: {
      type: DataTypes.CHAR(1),
      allowNull: false
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
    array_tower_position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    array_total_tower: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_pubacc_co',
    schema: 'dbo',
    timestamps: false
  });
};
