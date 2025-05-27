const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trades_types', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    trade_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'trades',
        key: 'trade_id'
      }
    },
    cert_type_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'cert_type',
        key: 'cert_type_id'
      }
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'trades_types',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_trade_types",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
