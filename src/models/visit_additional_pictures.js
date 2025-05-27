const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('visit_additional_pictures', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    visit_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'visits',
        key: 'visit_id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'visit_additional_pictures',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "visit_additional_pictures_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
