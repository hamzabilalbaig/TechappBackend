const {
  GetAllRoles,
  AddRole,
  UpdateRole,
  DeleteRole,
} = require("../services/roles.service");
const { responseFormat } = require("../utils/utils");

async function AllRoles(req, res, next) {
  try {
    const result = await GetAllRoles();
    res.json({
      success: true,
      message: "list of all roles",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Unexpected error while getting the list",
      data: [],
    });
    next(error);
  }
}

async function addNewRole(req, res, next) {
  try {
    const result = await AddRole(req.body);
    res.json(responseFormat(true, result, "Role Added Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while adding The role")
      );
    next(error);
  }
}

async function editRole(req, res, next) {
  try {
    const result = await UpdateRole(req.body, req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(false, result, "Unexpected error, Role update failed!")
      );
    } else {
      res.json(responseFormat(true, result, "Role Updated Successfully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while updating The Role")
      );
    next(error);
  }
}

async function removeRole(req, res, next) {
  try {
    const result = await DeleteRole(req.params.id);
    if (result == 0) {
      res.json(
        responseFormat(
          false,
          result,
          "Unexpected error, Unable to delete the role"
        )
      );
    } else {
      res.json(responseFormat(true, result, "Role Deleted Successfully"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while Deleting The role")
      );
    next(error);
  }
}

module.exports = {
  AllRoles,
  addNewRole,
  editRole,
  removeRole,
};
