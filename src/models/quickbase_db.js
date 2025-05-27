const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quickbase_db', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    table_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fields: {
      type: DataTypes.JSON,
      allowNull: true
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'quickbase_db',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "quickbase_db_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
