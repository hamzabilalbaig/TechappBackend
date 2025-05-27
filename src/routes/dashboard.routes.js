var express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.post("/activevisitcount", auth, dashboardController.countActiveVisits);
router.post("/visitsschedule", auth, dashboardController.visitsSchedule);
router.get("/sitecount", auth, dashboardController.countSites);
router.get("/projectcount", auth, dashboardController.countProjects);
router.get("/ticketcount", auth, dashboardController.countTickets);
router.get("/issuecount", auth, dashboardController.countIssues);
router.get("/interruptionscount", auth, dashboardController.countInterruptions);
router.get(
  "/interruptionsapprovedcount",
  auth,
  dashboardController.countApprovedInterruptions
);
router.get(
  "/interruptionscount/:id",
  auth,
  dashboardController.countInterruptionsByVisitId
);
router.get(
  "/interruptionsapprovedcount/:id",
  auth,
  dashboardController.countApprovedInterruptionsByVisitId
);
router.post(
  "/getVisitsFinancialDashboard",
  auth,
  dashboardController.getVisitsFinancialDashboard
);

router.post(
  "/dashboard/generalizeSearchAll",
  auth,
  dashboardController.generalizeSearchAll
);

module.exports = router;
