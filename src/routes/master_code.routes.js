var express = require("express");
var router = express.Router();
const master_code_controller = require("../controllers/master_code.controller");
const auth = require("../middlewares/auth");

router.get("/mastercodes", master_code_controller.AllMasterCodes);
router.get(
  "/mastercodes/:id",

  master_code_controller.getDetailCodeForMaster
);
router.post("/detailcodes", auth, master_code_controller.addDetailCode);
router.put("/detailcodes/:id", auth, master_code_controller.editDetailCode);
router.delete(
  "/detailcodes/:id",
  auth,
  master_code_controller.deleteDetailCode
);

module.exports = router;
