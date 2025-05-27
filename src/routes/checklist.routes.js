var express = require("express");
const { GetAllChecklist } = require("../controllers/checklist.controller");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/checklist", auth, GetAllChecklist);

module.exports = router;
