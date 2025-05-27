const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users_trades', {
    user_trade_id: {
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
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users_trades',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_trades_pkey",
        unique: true,
        fields: [
          { name: "user_trade_id" },
        ]
      },
    ]
  });
};
