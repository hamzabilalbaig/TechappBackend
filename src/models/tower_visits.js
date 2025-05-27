const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tower_visits', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
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
    jsa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pre_alpha_RRU: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pre_beta_RRU: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pre_gamma_RRU: {
      type: DataTypes.STRING,
      allowNull: true
    },
    post_alpha_RRU: {
      type: DataTypes.STRING,
      allowNull: true
    },
    post_beta_RRU: {
      type: DataTypes.STRING,
      allowNull: true
    },
    post_gamma_RRU: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tower_visits',
    schema: 'public',
    timestamps: false
  });
};
