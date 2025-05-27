const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('midband_fdd_tdd_scop', {
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
    load_new_scf: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fiveG_bbu_live: {
      type: DataTypes.DATE,
      allowNull: true
    },
    commission: {
      type: DataTypes.DATE,
      allowNull: true
    },
    perform_remote_ci: {
      type: DataTypes.DATE,
      allowNull: true
    },
    support_remove_integration: {
      type: DataTypes.DATE,
      allowNull: true
    },
    call_testing: {
      type: DataTypes.DATE,
      allowNull: true
    },
    live_e_nine_eleven_test: {
      type: DataTypes.DATE,
      allowNull: true
    },
    complete_integration_report: {
      type: DataTypes.DATE,
      allowNull: true
    },
    complete_scop: {
      type: DataTypes.DATE,
      allowNull: true
    },
    accept_site: {
      type: DataTypes.DATE,
      allowNull: true
    },
    material_pickup: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rma_decomm_form: {
      type: DataTypes.STRING,
      allowNull: true
    },
    show_ssc_cabinat_inside_pre_swap: {
      type: DataTypes.STRING,
      allowNull: true
    },
    show_ssc_cabinat_inside_post_swap: {
      type: DataTypes.STRING,
      allowNull: true
    },
    show_ssc_interior: {
      type: DataTypes.STRING,
      allowNull: true
    },
    router_mounted: {
      type: DataTypes.STRING,
      allowNull: true
    },
    catslite_scan: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abil_installations: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abil_asset_tags: {
      type: DataTypes.STRING,
      allowNull: true
    },
    asik_installations: {
      type: DataTypes.STRING,
      allowNull: true
    },
    asik_asset_tags: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abio_installations: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abio_asset_tags: {
      type: DataTypes.STRING,
      allowNull: true
    },
    asil_installations: {
      type: DataTypes.STRING,
      allowNull: true
    },
    asil_asset_tags: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'midband_fdd_tdd_scop',
    schema: 'public',
    timestamps: false
  });
};
