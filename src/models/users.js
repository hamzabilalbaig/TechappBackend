const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      user_id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "roles",
          key: "user_role_id",
        },
      },
      street_address: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      county: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      vendor_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vendor_record_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vendor_category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_card: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cell_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      alt_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergency_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergency_contact_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      driver_license_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dl_state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dl_exp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commercial_dl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_badge_exp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reports_to: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      onboarding_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      salary_rate: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      hourly_rate: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      day_rate: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      re_mob: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transport_fee: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      work_order_exp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tax_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      duns: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cage_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      diversity_classification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commercial_ins: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gl_limit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gl_issue_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      gl_expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      automobile_ins: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      auto_limit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      auto_issue_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      auto_expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      umbrella_ins: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      xs_limit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      xs_issue_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      xs_expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      wc_ins: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wc_limit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wc_issue_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      wc_expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      professional_liab_ins: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pl_limit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pl_issue_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pl_expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      coi_notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      msa_and_coi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_classification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      routing_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zoho_access: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comments: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reason_for_inactive: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiring_soon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiring_soon_gc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      termination_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      driver_license_attach: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work_order: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vendor_sp_link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customer_company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      related_project: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      operators: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qbk_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      safety_cert_record: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      records: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trades: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gc_licenses: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      project_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active_states: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ein_social: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      monthly_rate: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      expected_rate: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      user_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      booker_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      booker_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      booker_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      booker_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name_of_carrier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name_of_carrier_automobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name_of_carrier_umbrella: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name_of_carrier_wc: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name_of_carrier_professional: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rate_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "hourly",
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "vendors",
          key: "vendor_id",
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      street_address_two: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tour: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      fe_tour: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      pm_tour: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      changed_password: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      tagline: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shared_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      altitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      speed: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedIn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      google: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      other_link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      online: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_seen: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      work_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "unique_customerID",
          unique: true,
          fields: [{ name: "customer_id" }],
        },
        {
          name: "users_pkey",
          unique: true,
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
};
