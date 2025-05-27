const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('visit_financials', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    visit_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    user_driver_code_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'fe_user_driver_codes_mappings',
        key: 'id'
      }
    },
    fe_units: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    visit_expenses: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    driver_codes_total_amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approval_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    approve_comment: {
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
    tableName: 'visit_financials',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "visit_financials_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
