const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "site",
    {
      site_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Operator: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      region_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      market: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      project_status: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      pace: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ptn: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      loc_identifier: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      site_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      structure_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      lat_long: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      street_add: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      State: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      zip_code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      market_customer_specific: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      sitename: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      plan_category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      plan_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      construction_start: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rtt: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      program_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      FiveG_OA_Bands: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      psap_fcc_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      hard_cost_vendor: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ll_company: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ll_contact_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ll_contact_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ll_business_unit_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ll_contact_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ll_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fop_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fop_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fop_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      assignment_group: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      field_ops_safety_comments: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      field_ops_environment_hazards: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      ran_oem_poc_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ran_oem_poc_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ran_oem_poc_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ran_oem_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      last_updated: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      aav_provider: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      aav_poc_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      aav_poc_phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      aav_poc_email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      aav_oem_make_model_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      aav_oem_aav_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      site_access_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      directions_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gate_combo: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      equipment_combo: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      aav_access: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ll_last_updated: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      site_access_procedure: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      facility_access: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      access_24_7_flg: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      telco_access: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      telco_demark_location: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      telco_route_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      power_access: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      power_notify_fops: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      power_account_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      power_meter_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      power_gen_plug: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      power_route_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      faa_notam: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_update_aav: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_update_site_access: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      county: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_oem: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      street_address_two: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_new: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      last_updated_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      site_security_lock: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vz_sub_market: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_switch: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_dc_plantload_amps: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_dc_plantload_volts: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vz_network_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_rstr_isrestricted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      site_rstr_toweraccess: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_rstr_groundaccess: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_rstr_comments: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_access_restrictions: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vz_df_cran_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_main_lift_requirements: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      vz_fuze_site_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vz_fuze_site_subtype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vz_fuze_structure_owner: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vz_fuze_structure_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_tech_mgr_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_tech_mgr_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      site_tech_mgr_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "site",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "site_pkey",
          unique: true,
          fields: [{ name: "site_id" }],
        },
      ],
    }
  );
};
