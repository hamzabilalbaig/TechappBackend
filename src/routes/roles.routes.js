var express = require("express");
const rolesController = require("../controllers/roles.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/roles", auth, rolesController.AllRoles);
router.post("/roles", auth, rolesController.addNewRole);
router.put("/roles/:id", auth, rolesController.editRole);
router.delete("/roles/:id", auth, rolesController.removeRole);

module.exports = router;
