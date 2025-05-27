var express = require("express");
const formAccessControlController = require("../controllers/form_access_control.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/forms/allForms", auth, formAccessControlController.getForms);
router.get(
  "/forms/allFields/:form_id/:role_id",
  auth,
  formAccessControlController.getFieldsByFormID
);

router.get(
  "/forms/allFieldsWithPermissions/:form_id/:role_id",
  auth,
  formAccessControlController.getFieldsWithPermission
);
router.post(
  "/forms/fieldPermissions",
  auth,
  formAccessControlController.getFieldPermission
);
router.post(
  "/forms/addfieldsbyformid",
  auth,
  formAccessControlController.addAllFieldsByFormID
);

router.post(
  "/forms/setUpFieldPermissionsForTheFirstTime",
  auth,
  formAccessControlController.setUpFieldPermissionsForTheFirstTime
);

router.put(
  "/forms/updateFieldLevelPermissions",
  auth,
  formAccessControlController.updateFieldLevelPermissions
);

router.put(
  "/forms/updateFormField/:field_id",
  auth,
  formAccessControlController.updateFormField
);

router.post(
  "/forms/AddField/",
  auth,
  formAccessControlController.addSingleField
);

router.post(
  "/forms/setSingleFieldPermissionsForAllRole/",
  auth,
  formAccessControlController.setSingleFieldPermissionsForAllRole
);

module.exports = router;
