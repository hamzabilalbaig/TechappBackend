var express = require("express");
const certProviderController = require("../controllers/cert_provider.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/cert_providers", auth, certProviderController.allCertProviders);
router.post("/cert_providers", auth, certProviderController.createCertProvider);
router.put("/cert_providers/:id", auth, certProviderController.updateCertProvider);
router.delete("/cert_providers/:id", auth, certProviderController.removeCertProvider);
router.get("/cert_providersbycerttype/:id", auth, certProviderController.allCertProvidersByCertTypeId);

module.exports = router;