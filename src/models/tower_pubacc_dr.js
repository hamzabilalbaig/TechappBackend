const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_pubacc_dr', {
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
      unique: "unq_tower_pubacc_dr_faa_study_number"
    },
    date_keyed: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    sequence_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remark_text: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_pubacc_dr',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "unq_tower_pubacc_dr_faa_study_number",
        unique: true,
        fields: [
          { name: "faa_study_number" },
        ]
      },
    ]
  });
};
