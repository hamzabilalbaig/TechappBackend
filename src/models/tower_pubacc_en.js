const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_pubacc_en', {
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
      allowNull: true
    },
    unique_system_identifier: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      references: {
        model: 'tower_pubacc_ra',
        key: 'unique_system_identifier'
      }
    },
    entity_type: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    entity_type_code: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    entity_type_other: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    licensee_id: {
      type: DataTypes.CHAR(9),
      allowNull: true
    },
    entity_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    mi: {
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
    phone: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    fax: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    internet_address: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    street_address: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
    street_address2: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
    po_box: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    state: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    zip_code: {
      type: DataTypes.CHAR(9),
      allowNull: true
    },
    attention: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
    frn: {
      type: DataTypes.CHAR(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_pubacc_en',
    schema: 'dbo',
    timestamps: false
  });
};
