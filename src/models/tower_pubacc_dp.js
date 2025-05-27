const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_pubacc_dp', {
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
      unique: "unq_tower_pubacc_dp_faa_study_number"
    },
    faa_chapter_code: {
      type: DataTypes.STRING(14),
      allowNull: true
    },
    specification_option: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_pubacc_dp',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "unq_tower_pubacc_dp_faa_study_number",
        unique: true,
        fields: [
          { name: "faa_study_number" },
        ]
      },
    ]
  });
};
