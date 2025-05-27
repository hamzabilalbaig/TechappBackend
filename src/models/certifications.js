const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('certifications', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    verification_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approve_to_climb: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certifications_folder: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bbp_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    bbp_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    blood_borne_pathogens: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aeriel_list: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_aeriel_list: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capstan_use: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aerial_list_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    aerial_list_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bucket_truck_operator_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file_bucket_truck: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bucket_truck_certification: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_cad_welding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capstan_use_issued: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    capstan_use_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_capstan_use: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cad_welding_issued: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    capstan_use_certification_entity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cad_welding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capstan_use_certification_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    climber_rescue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    climber_rescue_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_confined_space: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_bbp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    climber_rescue_expires: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confined_space_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file_climber_rescue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    driver_license_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file_driver_license: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_first_aid_cpr_aed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    instructor_competent_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    first_aid_cpr_aed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    first_aid_cpr_aed_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    first_aid_cpr_aed_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    instructor_authorized_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    instructor_competent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    instructor_authorized: {
      type: DataTypes.STRING,
      allowNull: true
    },
    climber_rescue_certification_entity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    climber_rescue_certification_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    crane_operator_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    confined_space: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hazcom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_hazcom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    crane_spotter_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file_crane_operator: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_crane_spotter: {
      type: DataTypes.STRING,
      allowNull: true
    },
    crane_operator: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nokia_certifications: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ptid_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ptid_card: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ericsson_certifications: {
      type: DataTypes.STRING,
      allowNull: true
    },
    driver_license_state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    home_state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_osha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    crane_spotter_five: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certification_entity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certification_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    osha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_vendor_full_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_vendor_company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    osha_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file_rf_awareness: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rf_awareness: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rf_awareness_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rf_awareness_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file_instructor_competent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_instructor_authorized: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nwsa_certification: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hazcom_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file_nwsa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hazcom_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    crew_lead: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    expired_cert: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    expiring_cert_in_month: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ced_ch_one_ten: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ced_ch_eleven_twenty: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ch_one_ten_acknowledgement: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ch_one_ten_complete: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ch_eleven_twenty_acknowledgement: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ch_eleven_twenty_complete: {
      type: DataTypes.STRING,
      allowNull: true
    },
    crew_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_modified: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    last_modified_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    record_id_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    record_owner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_vendor_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_vendor_cell: {
      type: DataTypes.STRING,
      allowNull: true
    },
    related_vendor_vendor_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tmo_ericsson_integration_training: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tmo_ericsson_integration_training_cert: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tmo_nokia_integration_training: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tmo_nokia_integration_training_cert: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nfpa_archflash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nfpa_expires: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    file_nfpa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nfpa_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certification_company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nwsa_certification_expires: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nwsa_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file_rigger: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rigger: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rigger_certification_entity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rigger_certification_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    cert_entity_rfawareness: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_rfawareness: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_entity_bbp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_bbp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_entity_firstaid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_firstaid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_entity_hazcom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_hazcom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_entity_aeriallift: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_aeriallift: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_entity_buckettruck: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_buckettruck: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_entity_cadwelding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_cadwelding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_entity_nwsa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_nwsa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_entity_nfpaseventye: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cert_number_nfpaseventye: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_valid:{
      type:DataTypes.BOOLEAN,
      allowNull:true
    }
  }, {
    sequelize,
    tableName: 'certifications',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "certifications_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
