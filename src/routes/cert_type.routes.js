var express = require("express");
const certTypeController = require("../controllers/cert_type.controller");
var router = express.Router();
const auth = require("../middlewares/auth");


router.get("/cert_types", auth, certTypeController.allCertTypes);
router.post("/cert_types", auth, certTypeController.createCertType);
router.put("/cert_types/:id", auth, certTypeController.updateCertType);
router.delete("/cert_types/:id", auth, certTypeController.removeCertType);

module.exports = router;