const {
  GetPermissionsForRoleId,
  AddRole,
  UpdateRole,
  DeleteRole,
  GetPermissions,
  AddPermissionRole,
  UpdatePermissionRole,
  DeletePermissionRole,
} = require("../services/permissions.service");
const { responseFormat } = require("../utils/utils");

async function GetPermissionsForRole(req, res, next) {
  try {
    const result = await GetPermissionsForRoleId(req.params.roleId);
    res.json({
      success: true,
      message: "list of permissions",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the list",
      data: [],
    });
    next(error);
  }
}

async function GetPermissionsController(req, res, next) {
  try {
    const result = await GetPermissions(req.params.roleId);
    res.json({
      success: true,
      message: "list of permissions",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unexpected error while getting the list",
      data: [],
    });
    next(error);
  }
}

async function addPermissionRole(req, res, next) {
  try {
    const result = await AddPermissionRole(req.body);
    res.json(responseFormat(true, result, "Permission added Successfully"));
  } catch (error) {
    try {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            error?.errors[0]?.message ??
              "Unexpected error while adding The Permission"
          )
        );
      next(error);
    } catch {
      res.status(500);
      next(error);
    }
  }
}

async function editPermissionRole(req, res, next) {
  try {
    const result = await UpdatePermissionRole(
      req.body,
      req.params.roleId,
      req.params.permissionId
    );
    if (result == 0) {
      res.json(
        responseFormat(
          false,
          result,
          "Unexpected error, Permission update failed"
        )
      );
    } else {
      const io = req.io;
      io.emit("notification", { message: "Permission Updated" });
      res.json(responseFormat(true, result, "Permission Updated SuccessFully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          error.errors[0].message ??
            "Unexpected error while updating The Permission"
        )
      );
    next(error);
  }
}

async function removePermissionRole(req, res, next) {
  try {
    const result = await DeletePermissionRole(
      req.params.roleId,
      req.params.permissionId
    );
    if (result == 0) {
      res.json(
        responseFormat(
          false,
          result,
          "Unexpected error, Unable to delete the permission"
        )
      );
    } else {
      res.json(responseFormat(true, result, "Permission Deleted SuccessFully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Deleting The Permission"
        )
      );
    next(error);
  }
}

module.exports = {
  GetPermissionsForRole,
  GetPermissionsController,
  addPermissionRole,
  editPermissionRole,
  removePermissionRole,
};
