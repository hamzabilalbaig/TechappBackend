const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('certifications_files', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    certification_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'certifications',
        key: 'id'
      }
    },
    cert_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'certifications_files',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "certifications_files_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
