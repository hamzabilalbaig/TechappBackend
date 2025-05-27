const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "visits",
    {
      visit_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      field_engineer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      scheduled_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      cm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pm_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      driver_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      visit_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      billable: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cr_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      scope_activity: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      scope_completed: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      issues_encountered: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      material_used: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      time_in: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      time_out: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      on_site_time: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      travel_time_in: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      travel_time_out: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      travel_time: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      total_visit_time: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      time_in_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      time_out_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      revisit_required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      active_alarms_at_check_out: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      talonView_screenshot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      eod_send: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      units_of_work: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mla_checkin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      mla_checkout: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      outage_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nest_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nestIn_screenshot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nest_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nestOut_screenshot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jsa: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      complete_site_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mla_sign_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      compound_shelter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_photos: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_cabinet: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_covp_bottom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_covp_top: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_battery_cabinet: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_alpha_RRU: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_beta_RRU: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_gamma_RRU: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_cabinet: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_covp_bottom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_covp_top: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_battery_cabinet: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_alpha_RRU: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_beta_RRU: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      post_gamma_RRU: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      load_new_scf: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fiveG_bbu_live: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      commission: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      perform_remote_ci: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      support_remove_integration: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      call_testing: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      live_e_nine_eleven_test: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      complete_integration_report: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      complete_scop: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      accept_site: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      material_pickup: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rma_decomm_form: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      show_ssc_cabinat_inside_pre_swap: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      show_ssc_cabinat_inside_post_swap: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      show_ssc_interior: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      router_mounted: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      catslite_scan: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      abil_installations: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      abil_asset_tags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      asik_installations: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      asik_asset_tags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      abio_installations: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      abio_asset_tags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      asil_installations: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      asil_asset_tags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      visit_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      r_id: {
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      site_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_valid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      return_travel_time_in: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      return_travel_time_out: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      total_return_travel_time: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      total_travel_time: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      total_amount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      csr_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_photo_ciena_equipment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_photo_csr_cable_routing: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pre_photo_csr: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_overall_photos_north: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_overall_photos_east: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_overall_photos_south: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_overall_photos_west: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_modified_visit: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_modify_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      visit_amount: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      scope_progress: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      additional_total: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
      },
      pending_items: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      weather: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      billable_status_updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      billable_status_updated_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      billable_status_updated_at: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "visits",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "visits_pkey",
          unique: true,
          fields: [{ name: "visit_id" }],
        },
      ],
    }
  );
};
