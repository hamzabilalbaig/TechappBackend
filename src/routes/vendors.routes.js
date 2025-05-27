var express = require("express");
const vendorsController = require("../controllers/vendors.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.post("/vendors", auth, vendorsController.AddNewVendor);
router.post("/GetVendorDetailsFromQB", auth, vendorsController.GetVendorDetailsFromQB);
router.delete("/vendors/:id", auth, vendorsController.DeleteVendor);
router.get("/vendors", auth, vendorsController.GetAllVendors);
router.put("/vendors/:id", auth, vendorsController.UpdateVendor);

module.exports = router;
