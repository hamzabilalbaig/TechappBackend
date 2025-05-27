var DataTypes = require("sequelize").DataTypes;
var _Checklist = require("./Checklist");
var _checklist_files = require("./checklist_files");
var _checklist_fields = require("./checklist_fields");

var _Interruptions = require("./Interruptions");
var _cert_category = require("./cert_category");
var _cert_provider = require("./cert_provider");
var _cert_type = require("./cert_type");
var _cert_types_providers = require("./cert_types_providers");
var _certification_master = require("./certification_master");
var _certificates = require("./certificates");
var _certifications = require("./certifications");
var _certifications_files = require("./certifications_files");
var _customers = require("./customers");
var _permissions = require("./permissions");
var _permissions_roles = require("./permissions_roles");
var _project_sites_mappings = require("./project_sites_mappings");
var _roles = require("./roles");
var _projects = require("./projects");
var _tickets = require("./tickets");
var _site = require("./site");
var _users = require("./users");
var _trades = require("./trades");
var _user_files = require("./user_files");
var _user_folder = require("./user_folder");
var _master_code = require("./master_code");
var _detail_code = require("./detail_code");
var _issues = require("./issues");
var _projects_users = require("./projects_users");
var _projects_project_managers = require("./projects_project_managers");
var _midband_fdd_tdd_scop = require("./midband_fdd_tdd_scop");
var _notifications = require("./notifications");
var _tower_visits = require("./tower_visits");
var _users_trades = require("./users_trades");
var _vendors = require("./vendors");
var _visit_additional_pictures = require("./visit_additional_pictures");
var _visits = require("./visits");
var _speed_test_task = require("./speed_test_task");
var _visit_financials = require("./visit_financials");
var _visit_activity = require("./visit_activity");
var _driver_codes = require("./driver_codes");
var _fe_user_driver_codes_mappings = require("./fe_user_driver_codes_mappings");
var _form_field_role_permission = require("./form_field_role_permission");
var _form_fields = require("./form_fields");
var _forms = require("./forms");
var _refresh_tokens = require("./refresh_tokens");
var _visit_ratings = require("./visit_ratings");
var _quickbase_db = require("./quickbase_db");
var _trades_types = require("./trades_types");
var _visit_integration = require("./visit_integration");
var _tower_pubacc_at = require("./tower_pubacc_at");
var _tower_pubacc_co = require("./tower_pubacc_co");
var _tower_pubacc_de = require("./tower_pubacc_de");
var _tower_pubacc_dp = require("./tower_pubacc_dp");
var _tower_pubacc_dr = require("./tower_pubacc_dr");
var _tower_pubacc_ec = require("./tower_pubacc_ec");
var _tower_pubacc_en = require("./tower_pubacc_en");
var _tower_pubacc_hs = require("./tower_pubacc_hs");
var _tower_pubacc_ra = require("./tower_pubacc_ra");
var _tower_pubacc_re = require("./tower_pubacc_re");
var _tower_pubacc_rs = require("./tower_pubacc_rs");
var _tower_pubacc_sc = require("./tower_pubacc_sc");
function initModels(sequelize) {
  var Checklist = _Checklist(sequelize, DataTypes);
  var checklist_files = _checklist_files(sequelize, DataTypes);
  var checklist_fields = _checklist_fields(sequelize, DataTypes);

  var Interruptions = _Interruptions(sequelize, DataTypes);
  var cert_category = _cert_category(sequelize, DataTypes);
  var cert_provider = _cert_provider(sequelize, DataTypes);
  var cert_type = _cert_type(sequelize, DataTypes);
  var cert_types_providers = _cert_types_providers(sequelize, DataTypes);
  var certificates = _certificates(sequelize, DataTypes);
  var certification_master = _certification_master(sequelize, DataTypes);
  var certifications = _certifications(sequelize, DataTypes);
  var certifications_files = _certifications_files(sequelize, DataTypes);
  var customers = _customers(sequelize, DataTypes);
  var permissions = _permissions(sequelize, DataTypes);
  var permissions_roles = _permissions_roles(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var projects = _projects(sequelize, DataTypes);
  var tickets = _tickets(sequelize, DataTypes);
  var speed_test_task = _speed_test_task(sequelize, DataTypes);
  var trades = _trades(sequelize, DataTypes);
  var trades_types = _trades_types(sequelize, DataTypes);
  var site = _site(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var user_files = _user_files(sequelize, DataTypes);
  var user_folder = _user_folder(sequelize, DataTypes);
  var master_code = _master_code(sequelize, DataTypes);
  var detail_code = _detail_code(sequelize, DataTypes);
  var visit_ratings = _visit_ratings(sequelize, DataTypes);
  var refresh_tokens = _refresh_tokens(sequelize, DataTypes);
  var issues = _issues(sequelize, DataTypes);
  var visit_financials = _visit_financials(sequelize, DataTypes);
  var visit_integration = _visit_integration(sequelize, DataTypes);
  var driver_codes = _driver_codes(sequelize, DataTypes);
  var quickbase_db = _quickbase_db(sequelize, DataTypes);
  var tower_pubacc_at = _tower_pubacc_at(sequelize, DataTypes);
  var tower_pubacc_co = _tower_pubacc_co(sequelize, DataTypes);
  var tower_pubacc_de = _tower_pubacc_de(sequelize, DataTypes);
  var tower_pubacc_dp = _tower_pubacc_dp(sequelize, DataTypes);
  var tower_pubacc_dr = _tower_pubacc_dr(sequelize, DataTypes);
  var tower_pubacc_ec = _tower_pubacc_ec(sequelize, DataTypes);
  var tower_pubacc_en = _tower_pubacc_en(sequelize, DataTypes);
  var tower_pubacc_hs = _tower_pubacc_hs(sequelize, DataTypes);
  var tower_pubacc_ra = _tower_pubacc_ra(sequelize, DataTypes);
  var tower_pubacc_re = _tower_pubacc_re(sequelize, DataTypes);
  var tower_pubacc_rs = _tower_pubacc_rs(sequelize, DataTypes);
  var tower_pubacc_sc = _tower_pubacc_sc(sequelize, DataTypes);

  var fe_user_driver_codes_mappings = _fe_user_driver_codes_mappings(
    sequelize,
    DataTypes
  );
  var form_field_role_permission = _form_field_role_permission(
    sequelize,
    DataTypes
  );
  var visit_activity = _visit_activity(sequelize, DataTypes);
  var form_fields = _form_fields(sequelize, DataTypes);
  var forms = _forms(sequelize, DataTypes);
  var projects_users = _projects_users(sequelize, DataTypes);
  var projects_project_managers = _projects_project_managers(
    sequelize,
    DataTypes
  );
  var project_sites_mappings = _project_sites_mappings(sequelize, DataTypes);
  var midband_fdd_tdd_scop = _midband_fdd_tdd_scop(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);

  var tower_visits = _tower_visits(sequelize, DataTypes);
  var users_trades = _users_trades(sequelize, DataTypes);
  var vendors = _vendors(sequelize, DataTypes);
  var visit_additional_pictures = _visit_additional_pictures(
    sequelize,
    DataTypes
  );

  var visits = _visits(sequelize, DataTypes);
  certifications_files.belongsTo(certifications, {
    as: "certification",
    foreignKey: "certification_id",
  });
  certifications.hasMany(certifications_files, {
    as: "certifications_files",
    onDelete: "CASCADE",
    foreignKey: "certification_id",
  });
  certificates.belongsTo(certifications, {
    as: "certification",
    foreignKey: "certification_id",
  });
  certifications.hasMany(certificates, {
    as: "certificates",
    onDelete: "CASCADE",
    hooks: true,
    foreignKey: "certification_id",
  });
  issues.belongsTo(site, { as: "site", foreignKey: "site_id" });
  site.hasMany(issues, { as: "issues", foreignKey: "site_id" });

  issues.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(issues, { as: "issues", foreignKey: "user_id" });

  issues.belongsTo(visits, { as: "visit", foreignKey: "visit_id" });
  visits.hasMany(issues, { as: "issues", foreignKey: "visit_id" });

  visits.belongsTo(tickets, { as: "ticket", foreignKey: "ticket_id" });
  tickets.hasMany(visits, { as: "visits", foreignKey: "ticket_id" });
  visit_integration.belongsTo(visits, { as: "visit", foreignKey: "visit_id" });
  visits.hasOne(visit_integration, {
    as: "visit_integration",
    foreignKey: "visit_id",
  });
  // visits.belongsTo(site, { as: "site", foreignKey: "site_id" });
  // site.hasMany(visits, { as: "visits", foreignKey: "site_id" });

  // visits.belongsTo(projects, { as: "project", foreignKey: "project_id" });
  // projects.hasMany(visits, { as: "visits", foreignKey: "project_id" });
  checklist_files.belongsTo(Checklist, {
    as: "checklist",
    foreignKey: "checklist_id",
  });
  Checklist.hasMany(checklist_files, {
    as: "checklist_files",
    foreignKey: "checklist_id",
  });
  checklist_files.belongsTo(checklist_fields, {
    as: "checklist_field",
    foreignKey: "checklist_field_id",
  });
  checklist_fields.hasMany(checklist_files, {
    as: "checklist_files",
    foreignKey: "checklist_field_id",
  });
  checklist_fields.belongsTo(Checklist, {
    as: "checklist",
    foreignKey: "checklist_id",
  });
  Checklist.hasMany(checklist_fields, {
    as: "checklist_fields",
    foreignKey: "checklist_id",
  });
  checklist_fields.belongsTo(users, {
    as: "created_by_user",
    foreignKey: "created_by",
  });
  users.hasMany(checklist_fields, {
    as: "checklist_fields",
    foreignKey: "created_by",
  });
  certification_master.belongsTo(cert_provider, {
    as: "cert_provider",
    foreignKey: "cert_provider_id",
  });
  cert_provider.hasMany(certification_master, {
    as: "certification_masters",
    foreignKey: "cert_provider_id",
  });
  certification_master.belongsTo(cert_type, {
    as: "cert_type",
    foreignKey: "cert_type_id",
  });
  cert_type.hasMany(certification_master, {
    as: "certification_masters",
    foreignKey: "cert_type_id",
  });

  cert_type.belongsTo(cert_category, {
    as: "cert_category",
    foreignKey: "cert_category_id",
  });
  cert_types_providers.belongsTo(cert_provider, {
    as: "cert_provider",
    foreignKey: "cert_provider_id",
  });
  cert_provider.hasMany(cert_types_providers, {
    as: "cert_types_providers",
    foreignKey: "cert_provider_id",
  });
  cert_types_providers.belongsTo(cert_type, {
    as: "cert_type",
    foreignKey: "cert_type_id",
  });
  cert_type.hasMany(cert_types_providers, {
    as: "cert_types_providers",
    foreignKey: "cert_type_id",
  });
  cert_category.hasMany(cert_type, {
    as: "cert_categories",
    foreignKey: "cert_category_id",
  });
  notifications.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(notifications, { as: "notifications", foreignKey: "user_id" });
  trades.hasMany(users_trades, { as: "users_trades", foreignKey: "trade_id" });
  users_trades.belongsTo(trades, { as: "trade", foreignKey: "trade_id" });
  users_trades.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(users_trades, { as: "users_trades", foreignKey: "user_id" });
  trades_types.belongsTo(cert_type, {
    as: "cert_type",
    foreignKey: "cert_type_id",
  });
  cert_type.hasMany(trades_types, {
    as: "trades_types",
    foreignKey: "cert_type_id",
  });
  trades_types.belongsTo(trades, { as: "trade", foreignKey: "trade_id" });
  trades.hasMany(trades_types, { as: "trades_types", foreignKey: "trade_id" });

  users_trades.hasMany(trades_types, {
    foreignKey: "trade_id",
    sourceKey: "trade_id",

    as: "trades_types",
  });

  trades_types.belongsTo(users_trades, {
    foreignKey: "trade_id",
    targetKey: "trade_id",
    as: "users_trades",
  });
  certification_master.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(certification_master, {
    as: "certification_masters",
    foreignKey: "user_id",
  });
  master_code.hasMany(detail_code, {
    as: "detail_codes",
    foreignKey: "master_code_id",
  });

  detail_code.belongsTo(master_code, {
    as: "master_code",
    foreignKey: "master_code_id",
  });

  permissions.belongsToMany(roles, {
    as: "role_id_roles",
    through: permissions_roles,
    foreignKey: "permission_id",
    otherKey: "role_id",
  });
  roles.belongsToMany(permissions, {
    as: "permission_id_permissions",
    through: permissions_roles,
    foreignKey: "role_id",
    otherKey: "permission_id",
  });
  visit_activity.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(visit_activity, {
    as: "visit_activities",
    foreignKey: "user_id",
  });
  visit_activity.belongsTo(visits, { as: "visit", foreignKey: "visit_id" });
  visits.hasMany(visit_activity, {
    as: "visit_activities",
    foreignKey: "visit_id",
  });
  certifications.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasOne(certifications, {
    as: "certifications",
    foreignKey: "user_id",
  });
  users.belongsTo(roles, { as: "role", foreignKey: "user_role_id" });
  roles.hasMany(users, { as: "users", foreignKey: "user_role_id" });
  // users.belongsTo(customers, { as: "customer", foreignKey: "customer_id" });
  // customers.hasOne(users, { as: "user", foreignKey: "customer_id" });
  projects.belongsTo(customers, {
    as: "company_customer",
    foreignKey: "company",
  });
  customers.hasMany(projects, { as: "projects", foreignKey: "company" });
  customers.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasOne(customers, { as: "customers", foreignKey: "user_id" });
  tickets.belongsTo(projects, { as: "project", foreignKey: "project_id" });
  projects.hasMany(tickets, { as: "tickets", foreignKey: "project_id" });
  permissions_roles.belongsTo(permissions, {
    as: "permission",
    foreignKey: "permission_id",
  });
  permissions.hasMany(permissions_roles, {
    as: "permissions_roles",
    foreignKey: "permission_id",
  });
  permissions_roles.belongsTo(roles, { as: "role", foreignKey: "role_id" });

  form_fields.hasOne(form_field_role_permission, {
    as: "form_field_role_permission",
    foreignKey: "field_id",
  });

  roles.hasMany(permissions_roles, {
    as: "permissions_roles",
    foreignKey: "role_id",
  });

  projects.belongsToMany(users, {
    through: "projects_users",
    as: "users",
    foreignKey: "project_id",
  });

  users.belongsToMany(projects, {
    through: "projects_users",
    as: "projects",
    foreignKey: "user_id",
  });

  users.belongsToMany(driver_codes, {
    through: "fe_user_driver_codes_mappings",
    as: "driver_codes",
    foreignKey: "user_id",
  });

  fe_user_driver_codes_mappings.belongsTo(users, {
    as: "user",
    foreignKey: "user_id",
  });

  fe_user_driver_codes_mappings.belongsTo(driver_codes, {
    as: "driver_code",
    foreignKey: "driver_codes_id",
  });
  // fe_user_driver_codes_mappings.hasMany(visit_financials, {
  //   as:"visit_financials",
  //   onDelete: 'cascade',
  //   hooks:true,
  //   foreignKey:"user_driver_code_id"
  // });
  driver_codes.belongsToMany(users, {
    through: "fe_user_driver_codes_mappings",
    as: "users",
    foreignKey: "driver_codes_id",
  });
  site.belongsToMany(projects, {
    through: "project_sites_mappings",
    as: "projects",
    foreignKey: "site_id",
  });

  projects.belongsToMany(site, {
    through: "project_sites_mappings",
    as: "sites",
    foreignKey: "project_id",
  });

  projects.belongsToMany(users, {
    through: "projects_project_managers",
    as: "project_managers",
    foreignKey: "project_id",
  });
  users.belongsToMany(projects, {
    through: "projects_project_managers",
    as: "project_management_projects",
    foreignKey: "user_id",
  });
  tickets.belongsTo(site, { as: "site", foreignKey: "site_id" });
  site.hasOne(tickets, { as: "tickets", foreignKey: "site_id" });

  visit_additional_pictures.belongsTo(visits, {
    as: "visit",
    foreignKey: "visit_id",
  });
  visits.hasMany(visit_additional_pictures, {
    as: "visit_additional_pictures",
    foreignKey: "visit_id",
  });
  visits.belongsTo(users, {
    as: "field_engineer",
    foreignKey: "field_engineer_id",
  });
  visit_financials.belongsTo(fe_user_driver_codes_mappings, {
    as: "fe_user_driver_code",
    foreignKey: "user_driver_code_id",
  });

  visit_financials.belongsTo(users, {
    targetKey: "user_id",
    foreignKey: "approved_by",
  });
  // visits.belongsTo(site, {
  //   targetKey: "site_id",
  //   foreignKey: "site_id",
  // });
  visit_financials.belongsTo(visits, {
    targetKey: "visit_id",
    foreignKey: "visit_id",
  });
  users.hasMany(visits, { as: "visits", foreignKey: "field_engineer_id" });
  vendors.belongsTo(users, {
    as: "primary_user",
    foreignKey: "vendor_primary_user",
  });
  users.hasMany(vendors, {
    as: "primary_vendor",
    foreignKey: "vendor_primary_user",
  });
  user_folder.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(user_folder, { as: "user_folders", foreignKey: "user_id" });

  vendors.hasMany(users, {
    as: "vendor_users",
    foreignKey: "vendor_id",
  });
  users.belongsTo(vendors, {
    as: "vendor",
    foreignKey: "vendor_id",
  });
  speed_test_task.belongsTo(visits, { as: "visit", foreignKey: "visit_id" });
  visits.hasMany(speed_test_task, {
    as: "speed_test_tasks",
    foreignKey: "visit_id",
  });
  midband_fdd_tdd_scop.belongsTo(visits, {
    as: "visit",
    foreignKey: "visit_id",
  });
  visits.hasOne(midband_fdd_tdd_scop, {
    as: "midband_fdd_tdd_scops",
    foreignKey: "visit_id",
  });
  tower_visits.belongsTo(visits, { as: "visit", foreignKey: "visit_id" });
  visits.hasOne(tower_visits, { as: "tower_visits", foreignKey: "visit_id" });
  form_field_role_permission.belongsTo(form_fields, {
    as: "field",
    foreignKey: "field_id",
  });
  form_fields.hasMany(form_field_role_permission, {
    as: "form_field_role_permissions",
    foreignKey: "field_id",
  });
  form_fields.belongsTo(forms, { as: "form", foreignKey: "form_id" });
  forms.hasMany(form_fields, { as: "form_fields", foreignKey: "form_id" });
  form_field_role_permission.belongsTo(roles, {
    as: "role",
    foreignKey: "role_id",
  });
  roles.hasMany(form_field_role_permission, {
    as: "form_field_role_permissions",
    foreignKey: "role_id",
  });
  refresh_tokens.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasOne(refresh_tokens, { as: "refresh_tokens", foreignKey: "user_id" });
  visit_ratings.belongsTo(visits, { as: "visit", foreignKey: "visit_id" });
  visits.hasOne(visit_ratings, { as: "visit_ratings", foreignKey: "visit_id" });
  Interruptions.belongsTo(users, {
    as: "approved_by_user",
    foreignKey: "approved_by",
  });
  users.hasMany(Interruptions, {
    as: "Interruptions",
    foreignKey: "approved_by",
  });
  Interruptions.belongsTo(users, {
    as: "created_by_user",
    foreignKey: "created_by",
  });
  users.hasMany(Interruptions, {
    as: "created_by_Interruptions",
    foreignKey: "created_by",
  });
  Interruptions.belongsTo(users, {
    as: "modified_by_user",
    foreignKey: "modified_by",
  });
  users.hasMany(Interruptions, {
    as: "modified_by_Interruptions",
    foreignKey: "modified_by",
  });
  Interruptions.belongsTo(users, {
    as: "resolved_by_user",
    foreignKey: "resolved_by",
  });
  users.hasMany(Interruptions, {
    as: "resolved_by_Interruptions",
    foreignKey: "resolved_by",
  });
  Interruptions.belongsTo(visits, { as: "visit", foreignKey: "visit_id" });
  visits.hasMany(Interruptions, {
    as: "Interruptions",
    foreignKey: "visit_id",
  });
  tower_pubacc_at.belongsTo(tower_pubacc_ra, {
    as: "unique_system_identifier_tower_pubacc_ra",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ra.hasOne(tower_pubacc_at, {
    as: "tower_pubacc_at",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_co.belongsTo(tower_pubacc_ra, {
    as: "unique_system_identifier_tower_pubacc_ra",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ra.hasMany(tower_pubacc_co, {
    as: "tower_pubacc_cos",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ec.belongsTo(tower_pubacc_ra, {
    as: "unique_system_identifier_tower_pubacc_ra",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ra.hasOne(tower_pubacc_ec, {
    as: "tower_pubacc_ec",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_en.belongsTo(tower_pubacc_ra, {
    as: "unique_system_identifier_tower_pubacc_ra",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ra.hasMany(tower_pubacc_en, {
    as: "tower_pubacc_ens",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_hs.belongsTo(tower_pubacc_ra, {
    as: "unique_system_identifier_tower_pubacc_ra",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ra.hasOne(tower_pubacc_hs, {
    as: "tower_pubacc_h",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_re.belongsTo(tower_pubacc_ra, {
    as: "unique_system_identifier_tower_pubacc_ra",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ra.hasOne(tower_pubacc_re, {
    as: "tower_pubacc_re",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_rs.belongsTo(tower_pubacc_ra, {
    as: "unique_system_identifier_tower_pubacc_ra",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ra.hasOne(tower_pubacc_rs, {
    as: "tower_pubacc_r",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_sc.belongsTo(tower_pubacc_ra, {
    as: "unique_system_identifier_tower_pubacc_ra",
    foreignKey: "unique_system_identifier",
  });
  tower_pubacc_ra.hasOne(tower_pubacc_sc, {
    as: "tower_pubacc_sc",
    foreignKey: "unique_system_identifier",
  });

  return {
    Interruptions,
    certificates,
    certifications,
    certifications_files,
    customers,
    permissions,
    permissions_roles,
    roles,
    site,
    users,
    trades_types,
    users_trades,
    cert_category,
    user_files,
    user_folder,
    projects,
    tickets,
    master_code,
    detail_code,
    visit_additional_pictures,
    visits,
    visit_activity,
    midband_fdd_tdd_scop,
    tower_visits,
    vendors,
    form_field_role_permission,
    form_fields,
    visit_ratings,
    forms,
    refresh_tokens,
    quickbase_db,
    notifications,
    visit_integration,
    tower_pubacc_at,
    tower_pubacc_co,
    tower_pubacc_de,
    tower_pubacc_dp,
    tower_pubacc_dr,
    tower_pubacc_ec,
    tower_pubacc_en,
    tower_pubacc_hs,
    tower_pubacc_ra,
    tower_pubacc_re,
    tower_pubacc_rs,
    tower_pubacc_sc,
    Checklist,
    checklist_files,
    checklist_fields,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
