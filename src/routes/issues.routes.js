var express = require("express");
const issuesController = require("../controllers/issues.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/issues", auth, issuesController.allIssues);
router.post("/issues", auth, issuesController.addIssue);
router.put("/issues/:id", auth, issuesController.editIssue);
router.delete("/issues/:id", auth, issuesController.deleteIssue);

module.exports = router;
