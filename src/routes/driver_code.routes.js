var express = require("express");
const driverCodeController = require("../controllers/driver_code.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/driverCodes", auth, driverCodeController.allDriverCodes);
router.get("/driverCodes/:id", auth, driverCodeController.getDriverCodeByDriverCodeID);
router.post("/driverCodes", auth, driverCodeController.addDriverCode);
router.put("/driverCodes/:id", auth, driverCodeController.editDriverCode);
router.delete("/driverCodes/:id", auth, driverCodeController.deleteDriverCode);
//router.get("/driverCodes/:id", auth, driverCodeController.deleteDriverCode);




module.exports = router;
