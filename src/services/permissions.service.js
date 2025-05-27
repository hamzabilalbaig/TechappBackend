const { sequelizeServer } = require("../configs/sequelize.config");

async function GetPermissionsForRoleId(roleId) {
  try {
    const permissions = await sequelizeServer.models.permissions_roles.findAll({
      where: { role_id: roleId },
      include: ["permission","role"],
    });
    return permissions;
  } catch (err) {
    console.log(err);
  }
}

async function GetPermissions() {
  try {
    const permissions = await sequelizeServer.models.permissions.findAll({});
    return permissions;
  } catch (err) {
    console.log(err);
  }
}

async function AddPermissionRole(permission_role) {
  try {
    const permissions = await sequelizeServer.models.permissions_roles.findAll({
      where: {
        role_id: permission_role.role_id,
        permission_id: permission_role.permission_id,
      },
    });
    console.log(permissions, "AAAAAAAAAAAAA");
    if (permissions.length !== 0) {
      throw {
        errors: [
          { message: "Selected permission already exists againts this role" },
        ],
      };
    }
    var result =
      sequelizeServer.models.permissions_roles.create(permission_role);
    return result;
  } catch (error) {
    throw error;
  }
}

async function UpdatePermissionRole(permission_role, roleId, permissionId) {
  try {
    var result = sequelizeServer.models.permissions_roles.update(
      permission_role,
      {
        where: { role_id: roleId, permission_id: permissionId },
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

async function DeletePermissionRole(roleId, permissionId) {
  try {
    var result = sequelizeServer.models.permissions_roles.destroy({
      where: { role_id: roleId, permission_id: permissionId },
    });
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = {
  GetPermissionsForRoleId,
  GetPermissions,
  AddPermissionRole,
  UpdatePermissionRole,
  DeletePermissionRole,
};
