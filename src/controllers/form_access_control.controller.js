const {
  getAllFields,
  getAllForms,
  getFieldPermissionsByRoleID,
  addFieldsByFormID,
  setUpFieldPermissionsForAllRole,
  updateFieldPermissions,
  editFormField,
  setUpSingleFieldPermissionsForAllRole,
  addField,
  getAllFieldsWithPermissions,
} = require("../services/form_access_control.services");
const { responseFormat } = require("../utils/utils");

async function getForms(req, res, next) {
  try {
    const result = await getAllForms();
    res.json(responseFormat(true, result, "All Forms"));
  } catch (error) {
    res
      .status(500)
      .json(responseFormat(false, error, "Error while getting the list"));
    next(error);
  }
}

async function getFieldsByFormID(req, res, next) {
  getAllFields(req.params.form_id, req.params.role_id)
    .then((result) => {
      res.json(responseFormat(true, result, "All Fields"));
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while getting the list"
          )
        );
      next(error);
    });
}

async function getFieldsWithPermission(req, res, next) {
  getAllFieldsWithPermissions(req.params.form_id, req.params.role_id)
    .then((result) => {
      res.json(responseFormat(true, result, "All Fields"));
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while getting the list"
          )
        );
      next(error);
    });
}

async function getFieldPermission(req, res, next) {
  try {
    const result = await getFieldPermissionsByRoleID(req.body);
    res.json(responseFormat(true, result, "All Fields"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function addAllFieldsByFormID(req, res, next) {
  try {
    const result = await addFieldsByFormID(req.body);
    res.json(responseFormat(true, result, "All Fields Added SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function updateFormField(req, res, next) {
  try {
    const result = await editFormField(req.params.field_id, req.body);
    res.json(responseFormat(true, result, "Field Updated SuccessFully"));
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while Updating the Field"
        )
      );
    next(error);
  }
}

async function setUpFieldPermissionsForTheFirstTime(req, res, next) {
  try {
    const result = await setUpFieldPermissionsForAllRole(req.body);
    res.json(
      responseFormat(true, result, "All Fields Permission Added SuccessFully")
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

async function addSingleField(req, res, next) {
  await addField(req.body)
    .then((result) => {
      res.json(responseFormat(true, result, "Field Added SuccessFully"));
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while getting the list"
          )
        );
      next(error);
    });
}

async function setSingleFieldPermissionsForAllRole(req, res, next) {
  await setUpSingleFieldPermissionsForAllRole(req.body)
    .then((result) => {
      res.json(
        responseFormat(true, result, "All Field Permission Added SuccessFully")
      );
    })
    .catch((error) => {
      res
        .status(500)
        .json(
          responseFormat(
            false,
            error,
            "Unexpected error while getting the list"
          )
        );
      next(error);
    });
}

async function updateFieldLevelPermissions(req, res, next) {
  try {
    const result = await updateFieldPermissions(req.body);
    res.json(
      responseFormat(true, result, "Fields Permission Updated SuccessFully")
    );
  } catch (error) {
    res
      .status(500)
      .json(
        responseFormat(false, error, "Unexpected error while getting the list")
      );
    next(error);
  }
}

module.exports = {
  getForms,
  getFieldsByFormID,
  getFieldPermission,
  addAllFieldsByFormID,
  setUpFieldPermissionsForTheFirstTime,
  setSingleFieldPermissionsForAllRole,
  updateFieldLevelPermissions,
  updateFormField,
  addSingleField,
  getFieldsWithPermission
};
