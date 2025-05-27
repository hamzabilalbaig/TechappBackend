var express = require("express");
const certCategoryController = require("../controllers/cert_category.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/cert_categories", auth, certCategoryController.allCertCategories);
router.post("/cert_categories", auth, certCategoryController.createCertCategory);
router.put("/cert_categories/:id", auth, certCategoryController.updateCertCategory);
router.delete("/cert_categories/:id", auth, certCategoryController.removeCertCategory);

module.exports = router;