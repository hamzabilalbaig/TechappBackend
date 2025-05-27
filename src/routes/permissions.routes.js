var express = require("express");
const permissionsController = require("../controllers/permissions.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/permissions/:roleId", permissionsController.GetPermissionsForRole);
router.get("/permissions/", permissionsController.GetPermissionsController);
router.post("/permissions/", permissionsController.addPermissionRole);
router.put(
  "/permissions/:roleId/:permissionId",
  permissionsController.editPermissionRole
);
router.delete(
  "/permissions/:roleId/:permissionId",
  permissionsController.removePermissionRole
);

module.exports = router;
