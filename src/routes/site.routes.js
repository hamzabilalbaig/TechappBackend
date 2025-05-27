const bcryptjs = require("bcryptjs");
var express = require("express");

const siteController = require("../controllers/site.controller");

var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/sites", siteController.allSites);
router.post("/allsitesbyvisits", auth, siteController.allSitesByVisits);

router.get("/sitesforDropdown", siteController.allSitesforDropdown);
router.post("/sites/CreateNewSite", siteController.addNewSite);
router.put("/sites/UpdateSite/:id", siteController.editSite);
router.post("/sites/filterSite", siteController.FilterSites);
router.post(
  "/sites/allSitesForSiteDropdownFilter",
  auth,
  siteController.allSitesForSiteDropdownFilter
);
router.post(
  "/sites/SiteCheck",
  auth,
  siteController.SiteCheck
);

router.delete("/sites/DeleteSite/:id", siteController.removeSite);
router.get("/sites/getSiteByID/:site_id", siteController.getSiteByID);
router.get(
  "/sites/checkSiteIdValidation/:id",
  auth,
  siteController.checkSiteIdValidation
);

router.post("/sites/getsitebypage", auth, siteController.getSiteByPaging);

module.exports = router;
