const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('visit_ratings', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    visit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'visits',
        key: 'visit_id'
      }
    },
    communication: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    troubleshooting: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    workmanship: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    punctuality: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'visit_ratings',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "visit_ratings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
