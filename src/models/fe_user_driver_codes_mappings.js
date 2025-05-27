const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fe_user_driver_codes_mappings', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    driver_codes_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'driver_codes',
        key: 'id'
      }
    },
    date_added:{
      type: DataTypes.DATE,
      allowNull: true
    },
    added_by:{
      type: DataTypes.STRING,
      allowNull: true
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'fe_user_driver_codes_mappings',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "fe_user_driver_codes_mappings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
