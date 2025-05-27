const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customers', {
    customer_id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    company_legal_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    shortcode: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    shipping_address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    billing_address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    business_description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    landline_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_person: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "to_char(nextval(sequence_for_alpha_numeric_customer_id"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'customers',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "customer_pkey",
        unique: true,
        fields: [
          { name: "customer_id" },
        ]
      },
    ]
  });
};
