const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('visit_integration', {
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
    technologies: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cabinet_full_front_pic_door_open_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cabinet_full_front_pic_door_open_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lte_nodes_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lte_nodes_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fiveg_nodes_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fiveg_nodes_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    threeg_nodes_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    threeg_nodes_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    router_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    router_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mit_bt_support_team_email_screens_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mit_bt_support_team_email_screens_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    router_picture_showing_port_up_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    router_picture_showing_port_up_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fsee_alarm_block_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fsee_alarm_block_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    alpha_cordex_delta_orion_picture_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    alpha_cordex_delta_orion_picture_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bts_screenshot_of_alarms_active_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bts_screenshot_of_alarms_active_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ret_naming_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ret_naming_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lte_sran_site_view_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lte_sran_site_view_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lte_sran_alarm_view_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lte_sran_alarm_view_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lte_sran_sfp_reading_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lte_sran_sfp_reading_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aafia_site_view_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aafia_site_view_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aafia_alarm_view_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aafia_alarm_view_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aafia_reading_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aafia_reading_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fiveg_site_view_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fiveg_site_view_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fiveg_alarm_view_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fiveg_alarm_view_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fiveg_sfp_reading_screenshot_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fiveg_sfp_reading_screenshot_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mit_vswr_result_file_upload_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mit_vswr_result_file_upload_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mit_rtwp_result_file_upload_pre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mit_rtwp_result_file_upload_post: {
      type: DataTypes.STRING,
      allowNull: true
    },
    configuration_status: {
      type: DataTypes.BOOLEAN,
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
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'visit_integration',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "visit_integration_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
